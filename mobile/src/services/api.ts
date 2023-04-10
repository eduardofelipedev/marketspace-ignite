import axios, { AxiosInstance, AxiosError } from 'axios';
import { storageAuthTokenGet, storageAuthTokenSave } from '../storage/storageAuthToken';
import { AppError } from '../utils/AppError';

type PromiseType = {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}


type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
    RegisterInterceptTokenManager: (signOut: SignOut) => () => void;
};








const api = axios.create({
   baseURL: 'http://192.168.2.103:3333'
}) as APIInstanceProps;


let failedQueue: Array<PromiseType> = [];

let isRefreshing = false;



api.RegisterInterceptTokenManager = signOut => {

    const interceptTokenManager = api.interceptors.response.use(response => response, async(requestError) => {        
        
        if(requestError?.response?.status === 401){            
            if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid' ){
                
                const token = await storageAuthTokenGet();                 
                if(!token){
                    signOut();
                    return Promise.reject(requestError);
                }               
                
                const originalRequestConfig = requestError.config;               

                if(isRefreshing){
                    return new Promise((resolve, reject) => {                        
                        failedQueue.push({
                            onSuccess: (token: string) => {
                                originalRequestConfig.headers['Authorization'] = `Bearer ${token}`;
                                resolve(api(originalRequestConfig));
                            },
                            onFailure: (error: AxiosError) => {
                                reject(error);
                            },
                        })                        
                    });
                }

                isRefreshing = true;                       

                return new Promise(async(resolve, reject) => {
                    try{                                                
                        
                        const { data } = await api.post('/sessions/refresh-token', {token});
                        
                        await storageAuthTokenSave(data.token);                  
                        
                        originalRequestConfig.headers['Authorization'] = `Bearer ${data.token}`;
                        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;                      
                        
                        
                        
                        failedQueue.forEach(request => {
                            request.onSuccess(data.token);
                            
                        });                        

                      resolve(api(originalRequestConfig));

                    }catch(error: any){
                        failedQueue.forEach(request => {
                            request.onFailure(error);
                        });
                        signOut();
                        reject(error);
                    }finally{
                        isRefreshing = false;
                        failedQueue = [];                        
                    }
                });

                


            }            
            signOut();
        }       
    


        if(requestError.response && requestError.response.data){
            console.log('testando');
            //console.log('test');
            return Promise.reject(new AppError(requestError.response.data.message));
        }else{
            console.log('testando');
            return Promise.reject(requestError);
        }
    });
   
    return () => {        
        api.interceptors.request.eject(interceptTokenManager);
    }
}

 
  
export { api };