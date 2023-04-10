import { VStack, Text, Box, HStack, Radio, Icon, ScrollView, Image, Skeleton, View, useToast, Switch, FormControl } from 'native-base';
import { CardHeader } from '../components/CardHeader';
import { Input } from '../components/input';
import { TextArea } from '../components/TextArea';

import { Controller, useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import React from 'react';
import { CheckBox } from '../components/CheckBox';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { AppNavigationRoutesProps } from '../routes/app.routes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, TouchableOpacity } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


import * as ImagePicker from 'expo-image-picker';

import 'react-native-get-random-values';
import { v4 as uuid  } from 'uuid';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { AppError } from '../utils/AppError';




export type FormDataProps = {
    title: string;
    description: string;
    price: string;
    isnew: string;
    accept_trade: boolean;
    payment: [
        {
            key: string,
            payment_pix: boolean,
            status: boolean
        },
        {
            key: string,
            payment_ticket: boolean;
            status: boolean
        },
        {
            key: string,
            payment_cash: boolean;
            status: boolean
        },
        {
            key: string,
            payment_card: boolean;
            status: boolean
        },
        {
            key: string,
            payment_deposit: boolean;
            status: boolean
        }                
    ];    
}

export type ImageProps = {
    name: string;
    type: string;
    uri: string;
}

const CreateAdsShema = yup.object({
    title: yup
        .string().required('Informe um titulo'),   
    description: yup
        .string()
        .required('Descreva o seu produto!')
        .min(5, 'A descrição deve ter pelo menos 5 caracteres!'), 
    isnew: yup
        .string()        
        .min(4, 'Informe se seu produto é novo ou usado!'),        
    price: yup
        .string().required('Informe o valor do produto')
        
});



export function Createads(){
    const { newAds, imageProduct, handleSetImageProduct, handleSetRemoveImageProduct, handleSetNewAds } = useAuth();
    const [isPhotoLoading, setIsPhotoLoading] = useState(false);
    const [iscancel, setIsCancel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast(); 
    
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormDataProps>({
        defaultValues:{
            title: '',
            isnew: '', 
            payment: [{
                key: 'pix',
                payment_pix: false,
                status: false
            },
            {
                key: 'ticket',
                payment_ticket: false,
                status: false
            },
            {
                key: 'cash',
                payment_cash: false,
                status: false
            },
            {
                key: 'card',
                payment_card: false,
                status: false
            },
            {
                key: 'deposit',
                payment_deposit: false,
                status: false
            }      

            ],
            
        },
        resolver: yupResolver(CreateAdsShema)
    });    

    const navigation = useNavigation<AppNavigationRoutesProps>();

    function handlebackMyAds(){        
        setIsLoading(true);        
        Alert.alert('Aviso', 'Deseja descartar todos os dados?', [
            {
                text: 'Não',
                onPress: () => {setIsLoading(false)},
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: () => {
                    reset();     
                    handleSetRemoveImageProduct([] as any);
                    setIsLoading(false);                           
                    navigation.navigate('myads');
                }
            },
            
        ]);   
    }

    function handleOpenAdPreviews(data: FormDataProps){
        setIsLoading(true);
        if(imageProduct.length === 0){
            Alert.alert('Aviso', 'Adicione pelo menos uma imagem para seu produto!');
            setIsLoading(false);
            return;
        }
        setTimeout(() => {
            handleSetNewAds(data);                   
            navigation.navigate('adpreviews');
            setIsLoading(false);
        }, 500);        
    }

    
        

    async function handleProductImage(){
        try{
            setIsPhotoLoading(true);
            const imageSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });
            if(imageSelected.canceled){
                console.log('Usuario cancelou o upload');
                return;
            }
            
            const fileExtension = imageSelected.assets[0].uri.split('.').pop();
            
            const photoFile = {
                name: `@${uuid()}.${fileExtension}`.toLowerCase(),
                uri: imageSelected.assets[0].uri,
                type: `${imageSelected.assets[0].type}/${fileExtension}`
            } as any;

            handleSetImageProduct(photoFile);
        }catch(error: any){
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Ops, Algo deu errado!';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }finally{
            setIsPhotoLoading(false);
        }    

    }

    function handleRemoveProductImage(name: string){
        setIsPhotoLoading(true);
        const remove = imageProduct.filter((x: any) => x.name != name);        
        handleSetRemoveImageProduct(remove);
        setIsPhotoLoading(false);
        toast.show({
            title: 'Imagem removida com sucesso!',
            placement: 'top',
            bgColor: 'green.500'
        });
    }

    function handleCancelForm(){
        setIsLoading(true);        
        Alert.alert('Aviso', 'Deseja descartar todos os dados?', [
            {
                text: 'Não',
                onPress: () => {setIsLoading(false)},
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: () => {
                    reset();     
                    handleSetRemoveImageProduct([] as any);
                    handleSetNewAds({} as any);
                    setIsLoading(false);                            
                    navigation.navigate('myads');
                }
            },
            
        ]);        
        
    }
    
    
    useFocusEffect(useCallback(() => {
        setIsLoading(true);        
        setTimeout(() => {
            if(newAds.title === undefined){
                reset();
                handleSetRemoveImageProduct([] as any);
                handleSetNewAds({} as any);
            }
            setIsLoading(false);
        }, 1000);   
    }, [newAds.title]));
    
    
    

    return(
        <VStack flex={1} bg='gray.600' justifyContent='space-between'>
            <CardHeader 
                isButtonLeft={true}
                title='Criar anúncio'
                onPress={handlebackMyAds}                
            />

            {
                isLoading ? <Loading /> :
         
            <ScrollView
                _contentContainerStyle={{pb: 280, }}
                showsVerticalScrollIndicator={false}          
            >
            <VStack px={9}  mt={6}>

                <Box>
                    <Text
                        fontFamily='heading'
                        fontSize={16}
                        color='gray.200'
                        mb={2}
                    >
                        Imagens
                    </Text>

                    <Text
                        fontSize={14}
                        fontFamily='body'
                        color='gray.300'
                    >
                        Escolha até 3 imagens para mostrar o quanto o seu produto é incrível!
                    </Text>

                    <HStack mt={4} >
                        {
                            isPhotoLoading ? 
                            <>
                            <Skeleton 
                                    w='32%'
                                    h={100}                                    
                                    rounded={6}
                                    startColor={'gray.600'}
                                    endColor={'gray.500'}
                                    mr={2}
        
                                />

                                <Skeleton 
                                    w='32%'
                                    h={100}                                    
                                    rounded={6}
                                    startColor={'gray.600'}
                                    endColor={'gray.500'}
                                    mr={2}
        
                                />
                                </>
                                :
                            imageProduct.map((item: ImageProps) => (
                                <Box
                                key={item.name}
                                h={100}
                                w='32%'
                                bg='gray.500'
                                rounded={6}
                                justifyContent='center'
                                alignItems='center'
                                mr={2}

                            >
                                <Image 
                                    
                                    source={{uri: item.uri}} 
                                    alt="Image" 
                                    rounded={6}
                                    
                                    w='full'
                                    h='full'
                                    resizeMode='cover'
                                    
                                   
                                    
                                />
                                <View
                                top={1}
                                right={1}
                                    position='absolute'
                                    w={6}
                                    h={6}
                                    rounded='full'
                                    bg='gray.200'
                                    alignItems='center'
                                    justifyContent='center'
                                >
                                    <TouchableOpacity
                                        onPress={() => handleRemoveProductImage(item.name)}
                                    >
                                    <Icon 
                                        as={AntDesign}
                                        name='close'
                                        size={4}
                                        color='gray.700'
                                    />
                                    </TouchableOpacity>
                                </View>
                            </Box>
                            ))
                        }
                        
                        
                        {
                            imageProduct.length === 3 ?
                            false
                            :
                            <TouchableOpacity
                            style={{
                                width: '32%'                                
                            }}
                            onPress={handleProductImage}
                        >
                            <Box
                                h={100}
                                w='full'
                                bg='gray.500'
                                rounded={6}
                                justifyContent='center'
                                alignItems='center'
                                mr={2}

                            >
                                <Icon 
                                    as={AntDesign}
                                    name='plus'
                                    size={18}
                                    color='gray.400'
                                />
                            </Box>
                        </TouchableOpacity>
                        }
                        
                        
                    </HStack>

                    <VStack>
                        <Text
                            mt={4}
                            mb={4}
                            fontSize={16}
                            fontFamily='heading'
                            color='gray.200'
                        >
                            Sobre o produto
                        </Text>

                        <Controller 
                            control={control}
                            name='title'
                            render={({field: {onChange, value}}) => (
                                <Input 
                                    placeholder='Titulo do anúncio'
                                    onChangeText={onChange}
                                    value={value}
                                    autoCorrect={false}
                                    errorMessage={errors.title?.message}
                                />
                            )}
                        />

                        <Controller 
                            control={control}
                            name='description'
                            render={({field: {onChange, value}}) => (
                                <FormControl isInvalid={!!errors.description?.message}>
                                    <TextArea 
                                        placeholder='Descrição do produto'
                                        mt={2}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCorrect={false}                                       
                                    />
                                    <FormControl.ErrorMessage>
                                        {errors.description?.message}                                        
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            )}
                        />
                        

                        

                        <Controller 
                            control={control}
                            name='isnew'
                            
                            render={({field: {onChange, value}}) => (
                                <FormControl isInvalid={!!errors.isnew?.message}>
                                    <Radio.Group name='isnew'  value={value} onChange={onChange}>
                                        <HStack mt={4} w='full' justifyContent='space-between'>
                                            <Radio value="novo" >
                                                Produto novo
                                            </Radio>
                                            <Radio value="usado">
                                                Produto usado
                                            </Radio>
                                        </HStack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {errors.isnew?.message}                                        
                                    </FormControl.ErrorMessage>
                                </FormControl>                                                     
                                
                            )}
                        
                        />

                        <Text 
                            mt={4} 
                            mb={2}
                            fontSize={16}
                            fontFamily='heading'
                            color='gray.200'
                        >
                            Venda
                        </Text>

                        <Controller 
                            control={control}
                            name='price'
                            render={({field: {onChange, value} }) => (
                                <Input 
                                    placeholder='Valor do produto'
                                    keyboardType='numeric'
                                    onChangeText={onChange}
                                    value={value === undefined ? value : value
                                    .replace(/\D/g,"")
                                    .replace(/(\d{1})(\d{14})$/,"$1.$2")
                                    .replace(/(\d{1})(\d{11})$/,"$1.$2")
                                    .replace(/(\d{1})(\d{8})$/,"$1.$2")
                                    .replace(/(\d{1})(\d{5})$/,"$1.$2")
                                    .replace(/(\d{1})(\d{1,2})$/,"$1,$2")
                                }
                                errorMessage={errors.price?.message}                                    
                                    InputLeftElement={
                                        <Text
                                            ml={4}
                                            mr={-6}
                                            color='gray.100'
                                            fontFamily='body'
                                            fontSize={16}
                                        >
                                            R$
                                        </Text>                                        
                                    }
                                />
                            )}
                        />

                        
                     

                        <Text 
                            mt={4} 
                            mb={2}
                            fontSize={16}
                            fontFamily='heading'
                            color='gray.200'
                        >
                            Aceita troca?
                        </Text>

                        
                        <Controller 
                            control={control}
                            name='accept_trade'
                            render={({field: {onChange, value} }) => (
                                <Switch    
                                    value={value}
                                    w='15%'                                                  
                                    size='lg'
                                    onToggle={onChange}
                                />
                            )}                           
                        />
                        
                        
                        



                        <Text
                            mb={2}
                            fontSize={16}
                            fontFamily='heading'
                            color='gray.200'
                        >
                            Meios de pagamento aceitos
                        </Text>
                        <Controller
                            control={control}
                            name='payment.1'
                            render={({field: {onChange, value}}) => (
                                <CheckBox 
                                    bg={value.payment_ticket ? 'blue.500' : 'transparent'}                           
                                    borderWidth={2}
                                    borderColor={value.payment_ticket ? 'blue.500' : 'gray.400'}
                                    onPress={() => {onChange({...value, payment_ticket: !value.payment_ticket, status: !value.status})}}
                                    _pressed={{
                                        backgroundColor: 'none'
                                    }}
                                    isIcon={value.payment_ticket}
                                    title='Boleto'                           
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='payment.0'
                            render={({field: {onChange, value}}) => (
                                <CheckBox 
                                    bg={value.payment_pix ? 'blue.500' : 'transparent'}                           
                                    borderWidth={2}
                                    borderColor={value.payment_pix ? 'blue.500' : 'gray.400'}
                                    onPress={() => {onChange({...value, payment_pix: !value.payment_pix, status: !value.status})}}
                                    _pressed={{
                                        backgroundColor: 'none'
                                    }}
                                    isIcon={value.payment_pix}
                                    title='Pix'                           
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='payment.2'
                            render={({field: {onChange, value}}) => (
                                <CheckBox 
                                    bg={value.payment_cash ? 'blue.500' : 'transparent'}                           
                                    borderWidth={2}
                                    borderColor={value.payment_cash ? 'blue.500' : 'gray.400'}
                                    onPress={() => {onChange({...value, payment_cash: !value.payment_cash, status: !value.status})}}
                                    _pressed={{
                                        backgroundColor: 'none'
                                    }}
                                    isIcon={value.payment_cash}
                                    title='Dinheiro'                           
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='payment.3'
                            render={({field: {onChange, value}}) => (
                                <CheckBox 
                                    bg={value.payment_card ? 'blue.500' : 'transparent'}                           
                                    borderWidth={2}
                                    borderColor={value.payment_card ? 'blue.500' : 'gray.400'}
                                    onPress={() => {onChange({...value, payment_card: !value.payment_card, status: !value.status})}}
                                    _pressed={{
                                        backgroundColor: 'none'
                                    }}
                                    isIcon={value.payment_card}
                                    title='Cartão de Crédito'                           
                                />
                            )}
                        />


                        <Controller
                            control={control}
                            name='payment.4'
                            render={({field: {onChange, value}}) => (
                                <CheckBox 
                                    bg={value.payment_deposit ? 'blue.500' : 'transparent'}                           
                                    borderWidth={2}
                                    borderColor={value.payment_deposit ? 'blue.500' : 'gray.400'}
                                    onPress={() => {onChange({...value, payment_deposit: !value.payment_deposit, status: !value.status})}}
                                    _pressed={{
                                        backgroundColor: 'none'
                                    }}
                                    isIcon={value.payment_deposit}
                                    title='Depósito Bancário'                           
                                />
                            )}
                        />
                        

                       
                        
                        
                    </VStack>
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
                            title='Cancelar'
                            w='48%'                       
                            onPress={handleCancelForm}
                            variant='secondary'
                            isLoading={iscancel}
                            _spinner={{
                                color: 'gray.100'
                            }}
                            
                        
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
                            title='Avançar'
                            w='48%'                        
                            onPress={handleSubmit(handleOpenAdPreviews)}
                            variant='primary'
                            
                        
                        />
                    }                
               
            </HStack>
        </VStack>
    );
}