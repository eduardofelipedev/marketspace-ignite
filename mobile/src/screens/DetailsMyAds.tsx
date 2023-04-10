import { VStack, Text, HStack, Box, ScrollView, Icon, useToast } from 'native-base';
import { CardHeader } from '../components/CardHeader';
import { CaroselImages } from '../components/CaroselImages';
import { UserPhoto } from '../components/UserPhoto';
import { FormatNumber } from '../utils/FormatNumber';

import { Button } from '../components/Button';

import { MaterialCommunityIcons, AntDesign, Feather  } from '@expo/vector-icons'; 

import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../services/api';
import { useCallback, useState } from 'react';
import { ProductsDTO } from '../dtos/ProductsDTO';

import { AppError } from '../utils/AppError';

import defaultUserPhotoImg from '../assets/avatar.png';
import { ModalError } from '../components/ModalError';
import { useAuth } from '../hooks/useAuth';
import { AppNavigationRoutesProps } from '../routes/app.routes';
import { Loading } from '../components/Loading';



type RouteParamsProps =  {
    adId: string;
}

export function DetailsMyAds(){

    const toast = useToast();

    const { openAndCloseModalError, handleSetTitleError } = useAuth();


    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const route = useRoute();

    const { adId } = route.params as RouteParamsProps;
    
    const [product, setProduct] = useState<ProductsDTO>();

    const navigation = useNavigation<AppNavigationRoutesProps>();    
    
    function handleBackMyAds(){
        navigation.navigate('myads');
    }

    function handleOpenEditAd(id: string){
        navigation.navigate('editad', {adId: id});
    }


    async function handleFetchAdId(){
        try{
            setIsLoading(true);
            const response = await api.get(`/products/${adId}`, {timeout: 10000});
            setProduct(response.data);            
        }catch(error: any){
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
            setIsLoading(false);
        }
        
        
    }


    async function handleUpdateProductStatus(){
        try{
            setIsLoadingButton(true);
            await api.patch(`/products/${adId}`, {is_active: !product?.is_active});            
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
            setIsLoadingButton(false);
        }
    }

    async function handleRemoveProduct(id: string){
        try{
            setIsLoading(true);
            await api.delete(`/products/${id}`);
            
            toast.show({
                title: 'Anúncio removido com sucesso!',
                placement: 'top',
                bgColor: 'green.500',                
            });            
            navigation.navigate('myads');
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
            setIsLoading(false);
        }
    }   

    useFocusEffect(useCallback(() => {
        handleFetchAdId()
    }, [adId, isLoadingButton]));

    return(
            <>
            <VStack 
                bg='gray.600'            
                flex={1}           
            >
            
            <VStack                
                flex={1}
            >                 
                <CardHeader                 
                    isButtonLeft={true}
                    onFunctionLeft={handleBackMyAds}
                    isButtonRight={true}
                    onFunctionRight={() => handleOpenEditAd(product?.id as any)}
                    name='edit'                    
                />
               {
                isLoading ? <Loading />
                :
                <>
                    <ScrollView
                        _contentContainerStyle={{}}
                        showsVerticalScrollIndicator={false}                    
                    >
                    
                        <CaroselImages 
                            data={product?.product_images === undefined ? [{id: '', path: ''}] : product?.product_images}
                            is_active={product?.is_active}
                        />
                        
                    
                    
                    <VStack
                        px={8}
                        mt={6}
                    >
                
                    <HStack
                        alignItems='center'
                    >
                        
                            <UserPhoto 
                                size={10}
                                alt='Avatar'
                                mr={4}
                                source={product?.user.avatar === undefined ? defaultUserPhotoImg : {uri: `${api.defaults.baseURL}/images/${product.user.avatar}`}}
                            />
                    
                            <Text
                                color='gray.100'
                                fontFamily='body'
                                fontSize='md'
                            >
                                {product?.user.name}
                            </Text>
                        

                        
                    </HStack>

                
                        <Box
                            mt={6}
                            bg='gray.500'
                            w={20}
                            px={2}
                            py={1}
                            rounded={9999}
                            alignItems='center'
                        >
                            <Text
                                fontFamily='heading'
                                color='gray.200'
                                fontSize={10}
                            >
                                {product?.is_new ? 'NOVO' : 'USADO'}
                            </Text>
                        </Box>
                    

                    <HStack 
                        justifyContent='space-between'
                        mt={2}
                    >

                        

                        <Text
                            fontFamily='heading'
                            color='gray.100'
                            fontSize='20'
                        >
                            {product?.name}
                        </Text>
                        
                        <Text
                            fontFamily='heading'
                            fontSize='14'
                            color='blue.500'                    
                        >
                            R$ <Text fontFamily='heading' fontSize='20' color='blue.500'>{FormatNumber(product?.price)}</Text>
                        </Text>   
                        
                        
                    </HStack>

                    <VStack
                        mt={2}                    
                    >
                        
                            <Text
                                textTransform='capitalize'
                                fontSize='14'
                                fontFamily='body'
                                color='gray.200'
                            >
                                {product?.description}
                            </Text>
                    
                            <Text mt={2} color='gray.200' fontFamily='heading' fontSize='14'>
                                Aceita troca? <Text color='gray.200' fontFamily='body' fontSize='14'> {product?.accept_trade ? 'Sim' : 'Não'}</Text>
                            </Text>
                    
                            <Text mt={2}  color='gray.200' fontFamily='heading' fontSize='14'>
                                Meios de pagamento:
                            </Text>
                        

                        <Box mb={4} mt={2}>        

                            {
                                
                                product?.payment_methods.map((item: any) => (
                                    <HStack alignItems='center' w='full' mb={0} key={item.key}>
                                        <Icon 
                                            as={MaterialCommunityIcons}
                                            name={item.key === 'boleto' ? 'barcode-scan' : item.key === 'pix' ? 'qrcode' : item.key === 'cash' ? 'cash' : item.key === 'card' ? 'credit-card' : item.key === 'deposit' ? 'bank' : undefined}
                                            size={6}                                                    
                                            mr={4}
                                        />
                                        <Text  
                                            fontFamily='body'
                                            fontSize='14'
                                            color='gray.200'
                                        >                        
                                            {item.name}
                                        </Text>
                                    </HStack>
                                    
                                ))
                            }
                        
                            

                                


                        
                        </Box>
                        
                        
                        <VStack mb={8}>                       
                            <Button 
                                title={product?.is_active ? 'Desativar anúncio' : 'Reativar anúncio'}
                                startIcon={
                                    <Icon as={AntDesign} name="poweroff" size="sm" />
                                }
                                variant={product?.is_active ? 'primary' :  'default'}
                                onPress={handleUpdateProductStatus}
                                isLoading={isLoadingButton}
                            />

                            <Button 
                                title='Excluir anúncio'
                                startIcon={
                                    <Icon as={Feather} name="trash" size="sm" color='gray.200' />
                                }
                                onPress={() => handleRemoveProduct(product?.id as any) }
                                variant='secondary'
                                mt={2}
                            />                        
                    
                        </VStack>




                        


                    </VStack>

                    




                    </VStack>
                
                    </ScrollView>
                </>

               }
               
            </VStack>
            


            

            
            





        </VStack>
        <ModalError />
        </>
    
    );
}







































    




