import { Center, VStack, Text, View, Image, HStack, Skeleton, Box, Icon, ScrollView, useToast } from 'native-base';

import { useAuth } from '../hooks/useAuth';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Button } from '../components/Button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigationRoutesProps } from '../routes/app.routes';
import { UserPhoto } from '../components/UserPhoto';
import { api } from '../services/api';
import defaultUserPhotoImg from '../assets/avatar.png';
import { useCallback, useState } from 'react';
import { FormatNumber } from '../utils/FormatNumber';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Loading } from '../components/Loading';
import { AppError } from '../utils/AppError';





export function AdPreviews(){
    const { newAds, imageProduct, handleSetTitleError, openAndCloseModalError, handleSetRemoveImageProduct, handleSetNewAds, user } = useAuth();
    const navigation = useNavigation<AppNavigationRoutesProps>();
    const [isLoading, setIsLoading] = useState(false);
    const colorSkeleton = {start: 'gray.600', end: 'gray.500'};
    const toast = useToast();

    function renderSlides({item }: any){        
        return(           
            <View >
                <Image 
                    source={{uri: item.uri}}
                    alt='Imagem'
                    style={{
                        resizeMode: 'cover',
                        height: '100%',
                        width: '100%',                        
                    }}
                />
            </View>
            
        )
    }
    

    function handleBackCreateAds(){
        navigation.navigate('createads');
    }    

    async function handlePublishAds(){
        try{
            setIsLoading(true);
            const payment = newAds.payment.filter(item => {
                return (item.status === true);
            }).map(v => {
                return (v.key)
            })             
            
            
            const response = await api.post('/products/', {
                name: newAds.title,
                description: newAds.description,
                is_new: newAds.isnew === 'novo' ? true : false,
                price: parseInt(newAds.price.replace(/[^\d]+/g,'')),
                accept_trade: newAds === undefined ? false : true,
                payment_methods: payment
    
            })            

            const imageProductUploadForm = new FormData();
            imageProductUploadForm.append('product_id', response.data.id);
            imageProduct.forEach((element: any) => {
                imageProductUploadForm.append('images', element);
            });           

            await api.post('/products/images/', imageProductUploadForm, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.show({
                title: 'Parabéns, seu anúncio foi cadastrado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });            
            
            handleSetNewAds({} as any);        
            handleSetRemoveImageProduct([] as any);
            navigation.navigate('myads');

           
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
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);        
    }, []));

    return(
        <VStack flex={1}>
            <Center
                bg='blue.500'
                pt={16}
                pb={4}
            >
                <Text
                    fontFamily='heading'
                    fontSize={16}
                    color='gray.700'
                >
                    Pré visualização do anúncio
                </Text>
                <Text
                     fontFamily='body'
                     fontSize={14}
                     color='gray.700'
                >
                    É assim que seu produto vai aparecer!
                </Text>
            </Center>

            
            {
                isLoading ? <Loading />
                :
            

            <ScrollView 
                _contentContainerStyle={{pb: 280, }}
                showsVerticalScrollIndicator={false}
            >
            <View h='280' w='full'>
                <AppIntroSlider                 
                    renderItem={renderSlides}
                    data={imageProduct}
                    style={{                        
                        height: '50%',                 
                    }}
                    activeDotStyle={{
                        width: '33.3%',
                        backgroundColor: '#D9D8DA' ,
                        marginBottom: -60,
                        height: 4
                    }}
                    dotStyle={{
                        width: '33.3%',
                        backgroundColor: '#F7F7F8',
                        marginBottom: -60,
                        height: 4            
                    }}

                    showNextButton={false}
                    showDoneButton={false}

                />
            </View>


            
            <VStack
                px={8}
                mt={6}
            >
            <HStack
                    alignItems='center'
                >
                    {
                        isLoading ?
                        <Skeleton 
                            w={10}
                            h={10}
                            mr={4}
                            rounded='full'
                            startColor={colorSkeleton.start}
                            endColor={colorSkeleton.end}
                        />
                        :
                        <UserPhoto 
                            size={10}
                            alt='Avatar'
                            mr={4}
                            source={user.avatar === undefined ? defaultUserPhotoImg : {uri: `${api.defaults.baseURL}/images/${user.avatar}`}}
                        />
                    }
                    
                    {
                        isLoading ?
                        <Skeleton 
                            w={32}
                            h={5}
                            rounded={8}
                            startColor={colorSkeleton.start}
                            endColor={colorSkeleton.end}
                        />
                        :
                        <Text
                            color='gray.100'
                            fontFamily='body'
                            fontSize='md'
                        >
                            {user.name}
                        </Text>
                    }

                    
                </HStack>


                {
                    isLoading ?
                    <Skeleton 
                        w={32}
                        h={5}
                        mt={6}
                        rounded={8}
                        startColor={colorSkeleton.start}
                        endColor={colorSkeleton.end}
                    />
                    :
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
                            textTransform='uppercase'
                        >
                            {newAds.isnew}
                        </Text>
                    </Box>
                }


                <HStack 
                    justifyContent='space-between'
                    mt={2}
                >

                    {
                        isLoading ?
                        <Skeleton 
                            w={32}
                            h={5}
                            rounded={8}
                            startColor={colorSkeleton.start}
                            endColor={colorSkeleton.end}
                        />
                        :

                        <Text
                            fontFamily='heading'
                            color='gray.100'
                            fontSize='20'

                        >
                            {newAds.title}
                        </Text>
                    }
                    

                    {
                        isLoading ?
                        <Skeleton 
                            w={32}
                            h={5}
                            rounded={8}
                            startColor={colorSkeleton.start}
                            endColor={colorSkeleton.end}
                        />
                        :
                        <Text
                            fontFamily='heading'
                            fontSize='14'
                            color='blue.500'                    
                        >
                            R$ <Text fontFamily='heading' fontSize='20' color='blue.500'>{newAds.price === undefined ? undefined : FormatNumber(parseInt(newAds.price.replace(/[^\d]+/g,'')))}</Text>
                        </Text>   
                    }

                    
                </HStack>

                    {
                        isLoading ?
                        <Skeleton 
                            w='full'
                            h={16}
                            rounded={8}
                            startColor={colorSkeleton.start}
                            endColor={colorSkeleton.end}
                        />
                        :
                        <Text
                            textTransform='capitalize'
                            fontSize='14'
                            fontFamily='body'
                            color='gray.200'
                        >
                            {newAds.description}
                        </Text>
                    }

                    {
                        isLoading ?
                        <Skeleton 
                            w={32}
                            h={5}
                            mt={4}
                            rounded={8}
                            startColor={colorSkeleton.start}
                            endColor={colorSkeleton.end}
                        />
                        :
                        <Text mt={2} color='gray.200' fontFamily='heading' fontSize='14'>
                            Aceita troca? <Text color='gray.200' fontFamily='body' fontSize='14'> {newAds.accept_trade ? 'Sim' : 'Não'}</Text>
                        </Text>
                    }

                    {
                        isLoading ?
                        
                        <Skeleton 
                            w={32}
                            h={5}
                            mt={6}
                            rounded={8}
                            startColor={colorSkeleton.start}
                            endColor={colorSkeleton.end}
                        />                            
                        :
                        <Text mt={2}  color='gray.200' fontFamily='heading' fontSize='14'>
                            Meios de pagamento:
                        </Text>
                    }


                    <Box mb={4} mt={2}>        

                        {
                            isLoading ?
                            <>
                                <Skeleton 
                                    w={16}
                                    h={4}
                                    mt={2}
                                    rounded={8}
                                    startColor={colorSkeleton.start}
                                    endColor={colorSkeleton.end}
                                />

                                <Skeleton 
                                    w={16}
                                    h={4}
                                    mt={2}
                                    rounded={8}
                                    startColor={colorSkeleton.start}
                                    endColor={colorSkeleton.end}
                                />
                            </>
                            :

                            
                                newAds.payment?.filter(item => (item.status === true)).map((v: any) => {
                                    return (
                                        <HStack alignItems='center' w='full' mb={0} key={v.key }>
                                            <Icon 
                                                as={MaterialCommunityIcons}
                                                name={v.payment_pix ? 'qrcode' : v.payment_ticket ? 'barcode-scan' : v.payment_cash ? 'cash' : v.payment_card ? 'credit-card' : v.payment_deposit ? 'bank' : undefined}
                                                size={6}                                    
                                                mr={4}
                                            />
                                            <Text  
                                                fontFamily='body'
                                                fontSize='14'
                                                color='gray.200'
                                            >                        
                                                {v.payment_pix ? 'Pix' : v.payment_ticket ? 'Boleto': v.payment_deposit ? 'Depósito Bancário' : v.payment_cash ? 'Dinheiro' : v.payment_card ? 'Cartão de Crédito' : false}
                                            </Text>
                                    </HStack>
                                    )
                                })
                                    
                            
                                
                        }
                    </Box>
            </VStack>




            </ScrollView>
            }
            <HStack
                bg='white'
                h={90}                
                px={8}
                alignItems='center'
                position='absolute'
                display='flex'
                bottom={0}
                left={0}
                right={0}
                justifyContent='space-between'                
            >
                
                {
                    isLoading ?
                    <Skeleton 
                        w='48%'
                        h={50}                                    
                        rounded={6}
                        startColor={'gray.600'}
                        endColor={'gray.500'}
                        mr={2}    
                    />
                    :
                    <Button 
                        title='Voltar e editar'
                        w='48%'                       
                        onPress={handleBackCreateAds}
                        variant='secondary'
                        isLoading={false}
                        _spinner={{
                            color: 'gray.100'
                        }}         
                        startIcon={
                            <Icon as={AntDesign} name="arrowleft" size="sm" color='gray.200' />
                        }   
                    
                    />
                }

                {
                    isLoading ?
                    <Skeleton 
                        w='48%'
                        h={50}                                    
                        rounded={6}
                        startColor={'gray.600'}
                        endColor={'gray.500'}
                        mr={2}    
                        
                    />
                    :
                    <Button 
                        title='Publicar'
                        w='48%'                        
                        onPress={handlePublishAds}
                        variant='default'  
                        startIcon={
                            <Icon as={AntDesign} name="tago" size="sm" />
                        }                  
                    />
                }  
                    
               
            </HStack>           
            
        </VStack>
    );
}