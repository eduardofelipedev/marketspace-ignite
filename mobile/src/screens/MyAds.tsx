import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CheckIcon, FlatList, HStack, Select, Text, useToast, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { CardAnnouncement } from '../components/CardAnnouncement';
import { CardHeader } from '../components/CardHeader';
import { Empty } from '../components/Empty';
import { Loading } from '../components/Loading';
import { ModalError } from '../components/ModalError';
import { ProductsDTO } from '../dtos/ProductsDTO';
import { useAuth } from '../hooks/useAuth';
import { AppNavigationRoutesProps } from '../routes/app.routes';
import { api } from '../services/api';
import { AppError } from '../utils/AppError';


export function MyAds(){
    const [isLoading, SetIsLoading] = useState(false);
    const [data, SetData] = useState<ProductsDTO[]>([]);
    const [myads, setMyads] = useState('todos');

    const toast = useToast();

    const { handleSetTitleError, openAndCloseModalError } = useAuth();

    

    const navigation = useNavigation<AppNavigationRoutesProps>();   

    function handleOpenMyAdDetails(id: string){
        navigation.navigate('detailsMyAds', {adId: id});
    }

    function handleBackHome(){
        navigation.goBack();
    }

    function handleOpenCreateAds(){
        navigation.navigate('createads');
    }

    async function handleFetchMyAds(){
        try{
            SetIsLoading(true);
            const response = await api.get('/users/products', {timeout: 10000});
                     
           
           if(myads === 'todos'){
                SetData(response.data);
           } else if(myads === 'novo'){
                const filter = response.data.filter((item: any) => item.is_new === true);
                SetData(filter);
           } else if(myads === 'usado'){
                const filter = response.data.filter((item: any) => item.is_new === false);
                SetData(filter);
           } else if(myads === 'desativado'){
                const filter = response.data.filter((item: any) => item.is_active === false);
                SetData(filter);
           } else {
                SetData(response.data);
           }
            
            
            
        }catch(error){
            const isError = JSON.stringify(error);
            
            if(isError === JSON.stringify('timeout of 10000ms exceeded')){
                
                handleSetTitleError('timeout of 10000ms exceeded');                
                return openAndCloseModalError(true);
            }
            if(isError === JSON.stringify('Network Error')){
                
                handleSetTitleError('Network Error');
                return openAndCloseModalError(true);
            }
            const isAppError = error instanceof AppError;     
            if(isAppError){
                toast.show({
                    title: isAppError,
                    placement: 'top',
                    bgColor: 'red.500'
                });
            };     
            
            
            handleSetTitleError('timeout of 10000ms exceeded');
            return openAndCloseModalError(true);
        }finally{
            SetIsLoading(false);
        }       
        
    }

    useFocusEffect(useCallback(() => {
        handleFetchMyAds();
    }, [myads]));

    return(
        <>
        <VStack flex={1} bg='gray.600'>
            <CardHeader 
                title='Meus anúncios'              
                isButtonLeft={true}
                isButtonRight={true}
                name='plus'
                onFunctionLeft={handleBackHome}
                onFunctionRight={handleOpenCreateAds}                
            />
            

            <VStack px={6} flex={1}>
                <HStack mt={8} mb={6} justifyContent='space-between' alignItems='center'>
                    <Text
                        fontFamily='body'
                        color='gray.200'
                        fontSize='md'
                        ml={2}
                    >
                        {data.length} anúncios
                    </Text>

             
                    <Select                        
                        minWidth={170}
                        fontFamily='body'
                        fontSize='sm'
                        color='gray.100'
                        rounded={16}
                        mr={2}                       
                        _selectedItem={{
                            bg: 'blue.500',
                            endIcon: <CheckIcon size="5" color='white' />,
                           _text: {
                            color: 'white',
                            fontFamily: 'body',                            
                           }
                        }}

                        _item={{
                            fontFamily: 'body',                            
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',                           
                            _pressed:{
                                bg: 'gray.600'
                            }                           
                        }}
                        selectedValue={myads}
                        onValueChange={itemValue => setMyads(itemValue)}
                        
                    >
                        <Select.Item 
                            label='Todos'
                            value='todos'
                        />

                        <Select.Item 
                            label='Produto novo'
                            value='novo'
                        />

                        <Select.Item 
                            label='Produto usado'
                            value='usado'
                        />

                        <Select.Item 
                            label='Desativado'
                            value='desativado'
                        />
                    </Select>


                </HStack>


                

               { 
                isLoading ? <Loading />           
                : 
                    <FlatList 
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <CardAnnouncement 
                                isAvatar={false}
                                data={item}
                                thumb={
                                    item.product_images[0]?.path ? `${api.defaults.baseURL}/images/${item.product_images[0].path}` : ''
                                }
                                onPress={() => handleOpenMyAdDetails(item.id)}
                            />
                        )}
                        numColumns={2}   
                        ListEmptyComponent={
                            <Empty />
                        }
                        _contentContainerStyle={{                            
                            paddingBottom: 6,                            
                        }}
                        showsVerticalScrollIndicator={false}                            
                    />
                }
                
            </VStack>
        </VStack>
        <ModalError />
        </>
    );
}