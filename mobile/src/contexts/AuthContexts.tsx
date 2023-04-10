import { createContext, ReactNode, useEffect, useState} from 'react';
import { ImageProps } from 'react-native';
import { AdFilterProps } from '../dtos/AdFilterDTO';
import { UserDTO } from '../dtos/UserDTO';
import { FormDataProps } from '../screens/CreateAds';
import { api } from '../services/api';
import { storageAuthTokenGet, storageAuthTokenSave, storageTokenRemove } from '../storage/storageAuthToken';
import { storageUserGet, storageUserRemove, storageUserSave } from '../storage/storageUsers';





export type AuthContextDataProps = {
    user: UserDTO;  
    signIn: (email: string, password: string) => Promise<void>;
    isLoadingUserStorageData: boolean;
    filterAds: AdFilterProps;
    openModal: boolean;
    openModalError: boolean;
    updateFilterAds: (data: AdFilterProps) => void;
    openAndCloseModal: (action: boolean) => void;
    openAndCloseModalError: (action: boolean) => void;
    handleSetTitleError: (title: string) => void;
    titleError: string;
    signOut: () => any;
    imageProduct: any;
    newAds: FormDataProps;
    handleSetImageProduct: (data: ImageProps) => void;
    handleSetNewAds: (data: FormDataProps) => void;
    handleSetRemoveImageProduct: (data: ImageProps) => void;   

}


type AuthContextProviderProps = {
    children: ReactNode;
}



export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);



export function AuthContextProvider({children} : AuthContextProviderProps){

    const [filterAds, setFilterAds] = useState<AdFilterProps>(
        {
            is_new: undefined,
            accept_trade: undefined,
            payment_pix: false,
            payment_card: false,
            payment_ticket: false,
            payment_cash: false,
            payment_deposit: false,
            name_product: undefined
        }
    );

    const [openModal, setOpenModal] = useState<boolean>(false);

    const [openModalError, setOpenModalError] = useState<boolean>(false);
    const [titleError, setTitleError] = useState<string>('');
    
    const [user, setUser] = useState({} as UserDTO);

    const [imageProduct, setImageProduct] = useState([] as any);

    const [newAds, setNewads] = useState({} as FormDataProps);
    

    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(false);



    function userAndTokenUpdate(userData: UserDTO, token: string){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;        
        setUser(userData);
    }


    async function storageUserAndTokenSave(userData: UserDTO, token: string){
        try{
            setIsLoadingUserStorageData(true);

            await storageUserSave(userData);

            await storageAuthTokenSave(token);

        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }


    async function signIn(email: string, password: string){
        try{
            
            const { data } = await api.post('/sessions', {email, password}, {timeout: 10000});
            
            if(data.user && data.token){
                setIsLoadingUserStorageData(true);                

                await storageUserAndTokenSave(data.user, data.token);
                userAndTokenUpdate(data.user, data.token);
            }   
        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }


    async function signOut(){
        try{
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO); 
            setFilterAds({}); 

            await storageUserRemove();
            await storageTokenRemove();
        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
        

    }



    function updateFilterAds(data: AdFilterProps){
        setFilterAds(data);
    }


    function openAndCloseModal(action: boolean){
        setOpenModal(action);
    }

    function openAndCloseModalError(action: boolean){
        setOpenModalError(action);
    }


    function handleSetTitleError(title: string){
        let message = '';
        if(title === 'timeout of 10000ms exceeded'){
            message = `Ops! Algo deu errado! Nós estamos resolvendo isso. (COD.500)`;
        }else if (title === 'Network Error'){
            message = `Seu telefone não esta conectado a internet, Verifique a sua conexão.`;
        }
        setTitleError(message);
    }


    function handleSetImageProduct(data: ImageProps){
        setImageProduct((prevList: any) => [...prevList, data])
    } 

    function handleSetRemoveImageProduct(data: ImageProps){
        setImageProduct(data);
        return;
    }

    function handleSetNewAds(data: FormDataProps){
        setNewads(data);
    }

    


    async function loadUserData(){
        try{
            setIsLoadingUserStorageData(true);

            const userLogged = await storageUserGet();

            const token = await storageAuthTokenGet();           

            if(userLogged && token){
                userAndTokenUpdate(userLogged, token);
            }
        }catch(error){
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }


    


    useEffect(() => {
        loadUserData();        
    },[])


    useEffect(() => {
        
        const Subscribe = api.RegisterInterceptTokenManager(signOut);       
        
        return () => {
            Subscribe();
        }
    }, [signOut]);



    return(
        <AuthContext.Provider
            value={{
                user: user,
                signIn,
                isLoadingUserStorageData,
                filterAds: filterAds,
                updateFilterAds,
                openAndCloseModal,
                openModal: openModal,
                openModalError: openModalError,
                openAndCloseModalError,
                handleSetTitleError,
                titleError: titleError,
                signOut,
                imageProduct: imageProduct,
                newAds: newAds,
                handleSetImageProduct,
                handleSetNewAds,
                handleSetRemoveImageProduct


            }}
            
        >
            {children}
        </AuthContext.Provider>
    );
}