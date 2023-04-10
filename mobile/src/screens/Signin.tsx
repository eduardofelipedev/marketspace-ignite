import { VStack, Text, Center, useToast, ScrollView } from "native-base";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import LogoSvg from '../assets/logo.svg';
import LogoTitleSvg from '../assets/marketspace.svg';
import { Button } from "../components/Button";
import { Input } from "../components/input";

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

import { Controller, useForm} from 'react-hook-form';
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { AppError } from "../utils/AppError";
import { ModalError } from "../components/ModalError";

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
const FormData = require('form-data');





type FormData = {
    email: string;
    password: string;
}


const signinShema = yup.object({
    email: yup
        .string().required('Informe o email')
        .email('Informe um email válido'),
    password: yup
        .string().required('Informe a senha')
        .min(6, 'A senha deve ter pelo menos 6 dígitos.')
});




export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const { signIn, openAndCloseModalError, handleSetTitleError } = useAuth();

    
    const navigation = useNavigation<AuthNavigatorRoutesProps>();


    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(signinShema)
    });


    function handleNewAccount(){
        navigation.navigate('signUp');
    }


    async function handleSignIn({email, password} : FormData){
        try{
            setIsLoading(true);
            await signIn(email, password);
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
            setIsLoading(false);
        }
    }




    
    

    return(
        <>
        <ScrollView
            _contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
        >
        
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                
            <VStack
                flex={1}
                justifyContent='space-between'
            >
                <VStack bg='gray.600' px={10} roundedBottom={24} pb={12}>
                
                    <Center mt={109}>

                    <LogoSvg 
                        style={{marginBottom: 15}}
                    />
                    <LogoTitleSvg />
                    <Text
                        color='gray.300'
                        fontSize={14}
                        fontFamily='body'
                    >
                        Seu espaço de compra e venda
                    </Text>
                    
                    <Text
                        color='gray.200'
                        fontSize={14}
                        fontFamily='body'
                        mt={16}
                    >
                        Acesse sua conta
                    </Text>


                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { onChange } }) => (
                            <Input 
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                onChangeText={onChange}
                                mt={4}
                                errorMessage={errors.email?.message}                            
                            />
                        )}
                    />
                    

                    <Controller 
                        control={control}
                        name='password'
                        render={({ field: { onChange } }) => (
                            <Input 
                                placeholder='Senha'
                                secureTextEntry                                
                                onChangeText={onChange}
                                mt={2}
                                onSubmitEditing={handleSubmit(handleSignIn)}
                                keyboardType='numeric'
                                returnKeyType='send'
                                errorMessage={errors.password?.message}
                            />                            
                        )}
                        
                    />                   

                    <Button 
                        title="Entrar"
                        mt={3}
                        isLoading={isLoading}
                        onPress={handleSubmit(handleSignIn)}                 
                    />


                    

                    </Center>
                    
                    
                </VStack>

                <Center px={10} pb={12}>
                    <Text
                        mb={4}
                        color='gray.200'
                        fontFamily='body'
                    >
                        Ainda não tem acesso?
                    </Text>

                    <Button 
                        title="Criar uma conta"
                        variant='secondary'
                        onPress={handleNewAccount}                 
                    />
                </Center>
            </VStack>
            
            </TouchableWithoutFeedback>
            
            </ScrollView>
            <ModalError />
            </>
        
       
    );
}


