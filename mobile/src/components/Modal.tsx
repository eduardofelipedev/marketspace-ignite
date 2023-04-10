import { Center, Modal as ModalNativeBase, VStack, Text, HStack, Container, Stack, Button, Pressable,  Icon, Switch, IModalProps } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

import { CheckBox } from './CheckBox';
import { AdFilterProps } from '../dtos/AdFilterDTO';
import { useAuth } from '../hooks/useAuth';




type Props = IModalProps & {    
    onFunctionClose?: () => void;
    onfunctionPix?: () => void;
}


export function Modal({onFunctionClose, onfunctionPix, ...rest} : Props){
    const [checked, setChecked] = useState<AdFilterProps>({
            is_new: undefined,
            accept_trade: undefined,
            payment_pix: false,
            payment_card: false,
            payment_ticket: false,
            payment_cash: false,
            payment_deposit: false,
            name_product: undefined            
    });


    const { updateFilterAds, openModal, openAndCloseModal } = useAuth();
    


    
    return(       
            
            

            <ModalNativeBase  
                isOpen={openModal}
                bg='gray.600' 
                h='85%' 
                mb={0} 
                marginTop='auto' 
                roundedTopLeft={24} 
                roundedTopRight={24} 
                w='full' 
                px={6} 
                {...rest}
            >
                <VStack  w='full' flex={1}>
                    <Center >
                        <Container w={38} h={1} bg='gray.400' mt={4}></Container>
                    </Center>

                    <HStack
                        mt={8}
                        mb={6}
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Text
                            fontFamily='heading'
                            color='gray.100'
                            fontSize={20}
                        >
                            Filtrar anúncios
                        </Text>




                        <Stack>
                            <Button
                                bg='transparent'
                                onPress={() => openAndCloseModal(false)}
                                _pressed={{
                                    rounded: 999,
                                    bg: 'gray.500'
                                }}                                
                            >
                                <Icon 
                                    as={MaterialIcons}
                                    name='close'
                                    size='xl'
                                    color='gray.400'
                                />
                            </Button>
                        </Stack>



                    </HStack>

                    <Text
                        fontFamily='heading'
                        color='gray.200'
                        fontSize='md'
                        mb={4}
                    >
                        Condição
                    </Text>

                    <HStack>
                        <Button 
                            rounded={999} 
                            p={0} 
                            px={5} 
                            h={10}  
                            w={24}
                            mr={2} 
                            bg={checked.is_new === true ? 'blue.500' : 'gray.400'}                            
                            _text={{
                                color: checked.is_new === true ? 'white' : 'gray.200',
                                fontFamily: 'heading',
                                fontSize: 'md'
                            }}
                            _pressed={{
                                bg: 'blue.500'
                            }}
                            onPress={() => setChecked({...checked, is_new: true})}
                            endIcon={checked.is_new === true ? 
                                <Pressable
                                    size={5}
                                    bg='gray.600'
                                    rounded={999}
                                    justifyContent='center'
                                    alignItems='center'
                                    onPress={() => setChecked({...checked, is_new: undefined})}
                                >
                                <Icon 
                                    as={MaterialIcons}
                                    name='close'
                                
                                />
                                </Pressable>
                                :
                                []

                            }
                        >
                            NOVO
                        </Button>

                        <Button 
                            rounded={999} 
                            p={0} 
                            px={5} 
                            h={10}  
                            w={24} 
                            bg={checked.is_new === false ? 'blue.500' : 'gray.400'}
                            _text={{
                                color: checked.is_new === false ? 'white' : 'gray.200',
                                fontFamily: 'heading',
                                fontSize: 'md',                                
                            }}
                            _pressed={{
                                bg: 'blue.500'
                            }}
                            onPress={() => setChecked({...checked, is_new: false})}
                               
                                endIcon={checked.is_new === false ? 
                                    <Pressable
                                        size={5}
                                        bg='gray.600'
                                        rounded={999}
                                        justifyContent='center'
                                        alignItems='center'
                                        onPress={() => setChecked({...checked, is_new: undefined})}
                                    >
                                    <Icon 
                                        as={MaterialIcons}
                                        name='close'                                    
                                    />
                                    </Pressable>
                                    :
                                    []

                                }                                
                                
                            
                        >
                            USADO
                            
                        </Button>
                    </HStack>

                    <VStack mt={8} justifyContent='flex-start' alignItems='flex-start'>
                        <Text
                            fontFamily='heading'
                            color='gray.200'
                            fontSize='md'
                        >
                            Aceita troca?
                        </Text>
                        <Stack>
                            <Switch 
                                isChecked={checked.accept_trade}
                                size='lg'
                                onToggle={() => setChecked({...checked, accept_trade: checked.accept_trade === undefined ? true : !checked.accept_trade})}
                            />
                        </Stack>
                    </VStack>

                    <VStack mt={4}>
                        <Text
                            fontFamily='heading'
                            color='gray.200'
                            fontSize='md'
                            mb={6}
                        >
                            Meios de pagamento aceitos
                        </Text>

                        

                        <CheckBox 
                           bg={checked.payment_pix ? 'blue.500' : 'transparent'}                           
                           borderWidth={2}
                           borderColor={checked.payment_pix ? 'blue.500' : 'gray.400'}
                           onPress={() => {setChecked({...checked, payment_pix: !checked.payment_pix})}}
                           _pressed={{
                            backgroundColor: 'none'
                           }}
                           isIcon={checked.payment_pix}
                           title='Pix'                           
                        />


                        <CheckBox 
                           bg={checked.payment_ticket ? 'blue.500' : 'transparent'}                           
                           borderWidth={2}
                           borderColor={checked.payment_ticket ? 'blue.500' : 'gray.400'}
                           onPress={() => {setChecked({...checked, payment_ticket: !checked.payment_ticket})}}
                           _pressed={{
                            backgroundColor: 'none'
                           }}
                           isIcon={checked.payment_ticket}
                           title='Boleto'                           
                        />


                        <CheckBox 
                           bg={checked.payment_cash ? 'blue.500' : 'transparent'}                           
                           borderWidth={2}
                           borderColor={checked.payment_cash ? 'blue.500' : 'gray.400'}
                           onPress={() => {setChecked({...checked, payment_cash: !checked.payment_cash})}}
                           _pressed={{
                            backgroundColor: 'none'
                           }}
                           isIcon={checked.payment_cash}
                           title='Dinheiro'                           
                        />


                        <CheckBox 
                           bg={checked.payment_card ? 'blue.500' : 'transparent'}                           
                           borderWidth={2}
                           borderColor={checked.payment_card ? 'blue.500' : 'gray.400'}
                           onPress={() => {setChecked({...checked, payment_card: !checked.payment_card})}}
                           _pressed={{
                            backgroundColor: 'none'
                           }}
                           isIcon={checked.payment_card}
                           title='Cartão de Crédito'                           
                        />


                        <CheckBox 
                           bg={checked.payment_deposit ? 'blue.500' : 'transparent'}                           
                           borderWidth={2}
                           borderColor={checked.payment_deposit ? 'blue.500' : 'gray.400'}
                           onPress={() => {setChecked({...checked, payment_deposit: !checked.payment_deposit})}}
                           _pressed={{
                            backgroundColor: 'none'
                           }}
                           isIcon={checked.payment_deposit}
                           title='Depósito Bancário'                           
                        />


                                      
                        

                        
                       

                    </VStack>


                    <HStack justifyContent='space-between' mt={8}>
                        <Button
                            bg='gray.400'
                            w='48%'
                            h={12}
                            rounded={6}
                            _text={{
                                color: 'gray.200',
                                fontFamily: 'heading',                                
                            }}
                            onPress={() => {updateFilterAds({}), setChecked({})}}
                            _pressed={{
                                bg: 'gray.300',                                
                            }}
                            
                        >
                            Resetar filtros
                        </Button>

                        <Button
                            bg='gray.100'
                            w='48%'
                            rounded={6}
                            _text={{
                                color: 'white',
                                fontFamily: 'heading'
                            }}
                            onPress={() => updateFilterAds(checked)}
                            _pressed={{
                                bg: 'gray.300'
                            }}
                        >
                            Aplicar filtros
                        </Button>
                    </HStack>
                    
                </VStack>
                
            </ModalNativeBase>
        
    );
}