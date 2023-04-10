import { HStack, VStack, Text, Heading, Icon, FlatList, useToast, Stack, Pressable, Skeleton } from 'native-base';
import { Button } from '../components/Button';
import { UserPhoto } from '../components/UserPhoto';

import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { CardAnnouncement } from '../components/CardAnnouncement';

import { api } from '../services/api';
import { useCallback, useState } from 'react';
import { ProductsDTO } from '../dtos/ProductsDTO';
import { Loading } from '../components/Loading';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Input } from '../components/input';
import { Modal } from '../components/Modal';


import { useAuth } from '../hooks/useAuth';

import qs from 'qs';
import { AppError } from '../utils/AppError';
import { Empty } from '../components/Empty';
import { ModalError } from '../components/ModalError';
import { AppNavigationRoutesProps } from '../routes/app.routes';
import { SplitNameString } from '../utils/SplitNameString';

import defaultUserPhotoImg from '../assets/avatar.png';











export function Home(){

    const toast = useToast();

    const { user, filterAds, handleSetTitleError, openAndCloseModal, updateFilterAds, openAndCloseModalError } = useAuth();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCount, setIsLoadingCount] = useState(false);    
    const [data, setData] = useState<ProductsDTO[]>([]);
    const [count, setCount] = useState<string>('');
    const [inputName, SetInputName] = useState('');

    const navigation = useNavigation<AppNavigationRoutesProps>();
    
    function handleOpenAdDetails(id: string){
        navigation.navigate('details', {adId: id})
    }

    function handleOpenMyAds(){
        navigation.navigate('myads');
    }

    function handleOpenCreateAds(){
        navigation.navigate('createads');
    }

    async function handleFetchStatusUserProduct(){
        try{
            setIsLoadingCount(true);
            const response = await api.get('/users/products', {timeout: 10000});        
            const count = response.data.filter((item: any) => item.is_active === true).length;
            setCount(count);
        }catch(error){
            const isError = JSON.stringify(error);
            
            if(isError === JSON.stringify('timeout of 10000ms exceeded')){
                setData([]);
                handleSetTitleError('timeout of 10000ms exceeded');                
                return openAndCloseModalError(true);
            }
            if(isError === JSON.stringify('Network Error')){
                setData([]);
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
            
            setData([]);
            handleSetTitleError('timeout of 10000ms exceeded');
            return openAndCloseModalError(true);
        }finally{
            setIsLoadingCount(false);
        }
            
       
            
       
        
        
    }       

    async function handleFetchProducts(){        
        try{                        
            setIsLoading(true);
            const dataParams = qs.stringify(
                {
                    payment_methods: [
                        filterAds.payment_pix ? 'pix' : undefined,
                        filterAds.payment_ticket ? 'boleto' : undefined,
                        filterAds.payment_cash ? 'cash' : undefined,
                        filterAds.payment_card ? 'card' : undefined,
                        filterAds.payment_deposit ? 'deposit' : undefined,
                    ], 
                    is_new: filterAds.is_new ? 'true' : filterAds.is_new === false ? 'false' : undefined,
                    accept_trade: filterAds.accept_trade ? 'true' : filterAds.accept_trade === false ? undefined : undefined,
                    query: filterAds.name_product === '' ? undefined : filterAds.name_product 
                }, 
                { indices: false }
            );                
            const response = await api.get(`/products?${dataParams}`, {timeout: 10000});        
            
            setData(response.data);   
            setIsLoading(false);
                  

        }catch(error: any){
            const isError = JSON.stringify(error);
            
            if(isError === JSON.stringify('timeout of 10000ms exceeded')){
                setData([]);
                handleSetTitleError('timeout of 10000ms exceeded');                
                return openAndCloseModalError(true);
            }
            if(isError === JSON.stringify('Network Error')){
                setData([]);
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
            
            setData([]);
            handleSetTitleError('timeout of 10000ms exceeded');
            return openAndCloseModalError(true);
           

            
            
        }finally{
            setIsLoading(false);
        }
        
    }
 
    useFocusEffect(useCallback(() => {
        handleFetchProducts();
        openAndCloseModal(false);
        handleFetchStatusUserProduct();        
    }, [filterAds]));

    
    return(
        <>
            <VStack
                flex={1}
                bg='gray.600'
                px={6}
            >
                <HStack mt={16}>
                    {
                        isLoading ?
                        <Skeleton 
                            size={45}
                            rounded='full'
                            startColor='gray.500'
                            endColor='gray.300'
                        />
                        :
                        <UserPhoto 
                            alt='User'
                            source={user.avatar ? {uri: `${api.defaults.baseURL}/images/${user.avatar}`} : defaultUserPhotoImg}
                            size={45}
                        />
                    }
                    

                    <VStack
                        ml={2}
                        flex={1}
                    >
                        <Text
                            fontFamily='body'
                            fontSize='md'
                        >
                            Bem vindo(a),
                        </Text>

                        <Heading
                            fontFamily='heading'
                            fontSize='md'
                            textTransform='capitalize'
                        >
                            {SplitNameString(user.name)}
                        </Heading>

                    </VStack>

                    <Button 
                        title='Criar anúncio'
                        variant='primary'
                        w={40}
                        onPress={handleOpenCreateAds}
                    />
                </HStack>

                <Text
                    color='gray.300'
                    fontFamily='body'
                    fontSize='sm'
                    mt={6}
                >
                    Seus produtos anunciados para venda
                </Text>

                <HStack 
                    bg='blue.700:alpha.10'
                    p={4} 
                    rounded={6} 
                    alignItems='center' 
                    mt={4}               
                >
                    <Icon 
                        as={MaterialCommunityIcons}
                        name='tag-outline'
                        size={8}
                        color='blue.700'                       
                    />
                    <VStack flex={1} ml={4}>
                    {
                                isLoadingCount ?
                                <Skeleton 
                                    w={24}
                                    h={4}
                                    rounded={8}
                                    startColor='gray.500'
                                    endColor='gray.400'
                                />
                                :
                        <Heading
                            fontFamily='heading'
                        >                            
                                {count}      
                            
                        </Heading>
                        }

                        <Text
                            fontFamily='body'
                            color='gray.200'
                        >
                            anúncios ativos
                        </Text>
                    </VStack>

                    <TouchableOpacity
                        onPress={handleOpenMyAds}
                    >
                        <HStack 
                            alignItems='center'                             
                        >
                            <Text
                                color='blue.700'
                                fontFamily='heading'
                                fontSize='sm'
                                mr={2}
                            >
                                Meus anúncios
                            </Text>

                            <Icon 
                                as={AntDesign}
                                name='arrowright'
                                size={6}
                                color='blue.700'                         
                            />
                        </HStack>
                        
                    </TouchableOpacity>
                </HStack>


                <Text
                    color='gray.300'
                    fontSize='sm'
                    fontFamily='body'
                    mt={8}
                >
                    Compre produtos variados
                </Text>

                <Stack w='full' justifyContent='center' mt={4} mb={4}>
                
                    <Input 
                        h={14}
                        value={inputName}
                        onChangeText={text => SetInputName(text)}
                        placeholder='Buscar anúncio'
                        InputRightElement={
                            <>
                                <Pressable onPress={() => {updateFilterAds({...filterAds, name_product: inputName})}}>
                                    <Icon as={<MaterialIcons name="search" />} size={8} mr="2" color='gray.200' />
                                </Pressable>
                                <Text fontSize={32} mr="2" color='gray.500'>|</Text>
                                
                                <Pressable onPress={() => openAndCloseModal(true)}>
                                    <Icon as={<Feather name="sliders" />} size={8} mr="3" color="gray.200" />
                                </Pressable>
                            </>
                            
                        }                     
                    
                    />
                    
                    
                    

                </Stack>    
                    
                

                {
                    isLoading ? <Loading /> :
                    <FlatList 
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <CardAnnouncement 
                                isAvatar={true}
                                data={item}
                                thumb={
                                    item.product_images[0]?.path ? `${api.defaults.baseURL}/images/${item.product_images[0].path}` : ''
                                }
                                onPress={() => handleOpenAdDetails(item.id)}
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
            <Modal />
            <ModalError />
        </>
    );
}


