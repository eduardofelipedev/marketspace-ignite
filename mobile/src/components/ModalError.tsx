import { Button, Center, Container, Modal, Text, VStack } from  'native-base';

import { useAuth } from '../hooks/useAuth';






export function ModalError(){
    const { openModalError ,openAndCloseModalError, titleError, signOut } = useAuth();


   



    return(       

        <Modal 
            isOpen={openModalError}
            mb={0} 
            marginTop='auto'
            h='25%'
            bg='white' 
            roundedTopLeft={24} 
            roundedTopRight={24}
            px={6}
            animationPreset={'slide'}            
        >

            <VStack  w='full' flex={1}>
                <Center >
                    <Container w={38} h={1} bg='gray.400' mt={4}></Container>
                </Center>

                <Text
                    fontFamily='body'
                    color='gray.300'
                    mt={10}
                    textAlign='center'
                >
                    {titleError}
                </Text>

                <Button
                    mt={6}
                    bg='blue.500'
                    rounded={6}
                    _pressed={{
                        bg: 'blue.400'
                    }}
                    onPress={() => {openAndCloseModalError(false), signOut()}}
                >
                    Ok, Intendi
                </Button>

            </VStack>

        </Modal>

    );
}






