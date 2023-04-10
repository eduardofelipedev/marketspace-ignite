import { VStack, Text, HStack, Box, ScrollView, Icon, Skeleton, useToast } from 'native-base';
import { CardHeader } from '../components/CardHeader';

import { CaroselImages } from '../components/CaroselImages';
import { UserPhoto } from '../components/UserPhoto';
import { FormatNumber } from '../utils/FormatNumber';
import { Linking } from 'react-native';
import { Button } from '../components/Button';

import { MaterialCommunityIcons, FontAwesome  } from '@expo/vector-icons'; 

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


export function Details(){

    const toast = useToast();

    const { openAndCloseModalError, handleSetTitleError } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const route = useRoute();

    const { adId } = route.params as RouteParamsProps;
    
    const [product, setProduct] = useState<ProductsDTO>();

    const navigation = useNavigation<AppNavigationRoutesProps>();    
    
    function handleBackHome(){
        navigation.goBack();
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

    useFocusEffect(useCallback(() => {
        handleFetchAdId()
    }, [adId]));
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
                    onFunctionLeft={handleBackHome}                   
                />
               
               <ScrollView
                    _contentContainerStyle={{flexGrow: 1}}
                    showsVerticalScrollIndicator={false}                
                >
                {
                    isLoading ? <Loading />
                    :
                    <>
                
                    <CaroselImages 
                        data={product?.product_images === undefined ? [{id: '', path: ''}] : product?.product_images}
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
                            >
                                {product?.is_new ? 'NOVO' : 'USADO'}
                            </Text>
                        </Box>
                    

                        <HStack 
                            justifyContent='space-between'
                            mt={6}
                        >

                        

                            <Text
                                fontFamily='heading'
                                color='gray.100'
                                fontSize='lg'
                            >
                                {product?.name}
                            </Text>
                        
                        

                        
                            <Text
                                fontFamily='heading'
                                fontSize='md'
                                color='blue.500'                    
                            >
                                R$ <Text fontFamily='heading' fontSize='22' color='blue.500'>{FormatNumber(product?.price)}</Text>
                            </Text>                      
                        </HStack>

                        <VStack
                            mt={4}                    
                        >
                        
                            <Text>
                                {product?.description}
                            </Text>
                    

                        
                            <Text mt={4} color='gray.200' fontFamily='heading' fontSize='md'>
                                Aceita troca? <Text color='gray.200' fontFamily='body' fontSize='md'> {product?.accept_trade ? 'Sim' : 'Não'}</Text>
                            </Text>
                        
                            <Text mt={6}  color='gray.200' fontFamily='heading' fontSize='md'>
                                Meios de pagamento:
                            </Text>
                    

                            <Box mb={40} mt={4}>        

                                {
                                    product?.payment_methods.map((item: any) => (
                                        <HStack alignItems='center' w='full' mb={0} key={item.key}>
                                            <Icon 
                                                as={MaterialCommunityIcons}
                                                name={item.key === 'boleto' ? 'barcode-scan' : item.key === 'pix' ? 'qrcode' : item.key === 'cash' ? 'cash' : item.key === 'card' ? 'credit-card' : item.key === 'deposit' ? 'bank' : undefined}
                                                size={8}                                        
                                                mr={4}
                                            />
                                            <Text  
                                                fontFamily='body'
                                                fontSize='md'
                                            >                        
                                                {item.name}
                                            </Text>
                                        </HStack>
                                        
                                    ))
                                }                 
                            </Box>
                        </VStack>
                    </VStack>          
                    </>
                }
                </ScrollView>
            </VStack>
            
            


            <HStack
                bg='white'
                h={90}
                px={8}
                alignItems='center'
                position='absolute'
                bottom={0}
                left={0}
                right={0}
                justifyContent='space-between'                
            >
                {
                    isLoading ? 
                    <>
                        <Skeleton 
                            w='40%'
                            h={12}
                            mr={4}
                            rounded='6'
                                
                        />
                        <Skeleton 
                            w='58%'
                            h={12}
                            mr={4}
                            rounded='6'
                                
                        />
                    </>
                    :
                    <>
                        <Text
                            fontFamily='heading'
                            fontSize='md'
                            color='blue.700'                    
                        >
                            R$ <Text fontFamily='heading' fontSize='22' color='blue.700'>{FormatNumber(product?.price)}</Text>
                        </Text> 
                    

                        <Button 
                            title='Entrar em contato'
                            w='60%'
                            leftIcon={<Icon as={FontAwesome} name="whatsapp" size="sm" />}
                            onPress={() => {Linking.openURL(`https://wa.me/${product?.user.tel.replace('+', '')}`)}}                    
                        />    
                    </>    


                }
                
                            
                
            </HStack>
        </VStack>
        <ModalError />
        </>
    
    );
}







































    




