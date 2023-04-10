import {Center, ScrollView, VStack, Text, Skeleton, useToast} from 'native-base';

import LogoSvg from '../assets/logo.svg';
import { UserPhoto } from '../components/UserPhoto';

import defaultUserPhotoImg from '../assets/avatar.png';
import { Input } from '../components/input';
import { Button } from '../components/Button';

import { useNavigation } from '@react-navigation/native';

import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from "yup";
import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuid  } from 'uuid';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Alert } from 'react-native';
import { AppError } from '../utils/AppError';
import { ModalError } from '../components/ModalError';


type FormDataProps = {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
}


const signUpSchema = yup.object({
    name: yup
        .string()
        .required('Informe o nome'),
    email: yup
        .string().required('Informe o email')
        .email('Informe um email válido'),
    phone: yup
        .string()
        .required('Informe um telefone')
        .min(14, 'O telefone não esta completo.'),
    password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .required('Informe a senha')
        .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
        

    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)       
        .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere. ') 
        
});


type photoProps = {
    name: string;
    type: string;
    uri: string;
}


export function SignUp(){

    const navigation = useNavigation();

    const { signIn, handleSetTitleError, openAndCloseModalError } = useAuth();
    const toast = useToast();

    const [userAvatar, setUserAvatar] = useState<photoProps>();
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [isLoading, SetIsLoading] = useState(false);

    

    const { control, handleSubmit, formState: { errors }} = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    function handleGoBack(){
        navigation.goBack();
    }

    async function handleSubmitRegister(data: FormDataProps){
        try{
            SetIsLoading(true);

            if(userAvatar === undefined){
                Alert.alert('Aviso', 'É obrigatório o envio da imagem.');
                SetIsLoading(false);
                return;
            }
    
    
            const form = new FormData();
            form.append('avatar', userAvatar as any);        
            form.append('name', data.name);
            form.append('email', data.email);
            form.append('tel', `${data.phone}`);
            form.append('password', data.password);
            
            const response = await api.post('/users', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 10000
            })
            
            if(response.status === 201){
                await signIn(data.email, data.password);
            }
        }catch(error: any){
            const isError = JSON.stringify(error.message);
            console.log(isError);
            if(isError === JSON.stringify('timeout of 10000ms exceeded')){
                handleSetTitleError('timeout of 10000ms exceeded');                
                return openAndCloseModalError(true);
            }

            if(isError === JSON.stringify('Network Error')){
                handleSetTitleError('Network Error');
                return openAndCloseModalError(true);
            }
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Ops, Algo deu errado!';
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }finally{
            SetIsLoading(false);
        }
       

        


    }

    async function handleUserAvatarSelect(){
        try{
            setIsAvatarLoading(true);
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            })

            if(photoSelected.canceled){
                return;
            }

            const fileExtension = photoSelected.assets[0].uri.split('.').pop();

            const photoFile = {
                name: `@${uuid()}.${fileExtension}`.toLowerCase(),
                uri: photoSelected.assets[0].uri,
                type: `${photoSelected.assets[0].type}/${fileExtension}`
            } as any;

            setUserAvatar(photoFile);
            




        }catch(error){
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Ops, Algo deu errado!';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }finally{
            setIsAvatarLoading(false);
        }
    }
    
    
    return(
        <>
        <ScrollView
            _contentContainerStyle={{ paddingBottom: 32}}
            showsVerticalScrollIndicator={false}
        >
            <VStack 
                flex={1}
                bg='gray.600'
                px={10}
            >
                <Center mt={20}>
                    <LogoSvg 
                    />

                    <Text
                        fontFamily='heading'
                        fontSize='lg'
                    >
                        Boas vindas!
                    </Text>

                    <Text 
                        textAlign='center'
                        fontFamily='body'
                        fontSize='sm'
                        mt={2}
                    >
                        Crie sua conta e use o espaço para comprar {'\n'}
                        itens variados e vender seus produtos
                    </Text>


                </Center>

                <Center>

                    {
                        isAvatarLoading ? 
                        <Skeleton 
                            w={88}
                            h={88}
                            mr={4}
                            rounded='full'
                            mt={6}
                            mb={4}                                
                        />
                        :
                        <UserPhoto 
                            size={88}
                            alt='User'
                            source={userAvatar ? {uri: `${userAvatar?.uri}`} : defaultUserPhotoImg}
                            mt={6}
                            mb={4}
                            isEdit={true}
                            onPress={handleUserAvatarSelect}
                        />
                    }
                    

                    <Controller 
                        control={control}
                        name='name'
                        render={({field: {value, onChange}}) => (
                            <Input 
                                placeholder='Nome'    
                                mt={2}                            
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    
                    />

                    <Controller 
                        control={control}
                        name='email'
                        render={({field: {value, onChange}}) => (
                            <Input 
                                placeholder='E-mail' 
                                autoCorrect={false}
                                mt={2}                                 
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    
                    />

                    <Controller 
                        control={control}
                        name='phone'
                        render={({field: {value, onChange}}) => (
                            <Input 
                                placeholder='Telefone'    
                                mt={2}                              
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.phone?.message}
                            />
                        )}
                    
                    />

                    <Controller 
                        control={control}
                        name='password'
                        render={({field: {value, onChange}}) => (
                            <Input 
                                placeholder='Senha'       
                                mt={2}                           
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    
                    />

                    <Controller 
                        control={control}
                        name='confirm_password'
                        render={({field: {value, onChange}}) => (
                            <Input 
                                placeholder='Confirmar Senha'
                                mt={2}  
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.confirm_password?.message}
                            />
                        )}
                    
                    />                    

                    <Button 
                        mt={2}  
                        title='Criar'
                        variant='primary'
                        onPress={handleSubmit(handleSubmitRegister)}
                        isLoading={isLoading}
                    />
                </Center>

                <Center>
                    <Text
                        mt={4}
                        mb={2}
                    >
                        Já tem uma conta?
                    </Text>

                    <Button 
                        title='Ir para o login'
                        variant='secondary'
                        mb={8}
                        onPress={handleGoBack}
                    />
                </Center>
            </VStack>
        </ScrollView>
        <ModalError />
        </>
    );
}



