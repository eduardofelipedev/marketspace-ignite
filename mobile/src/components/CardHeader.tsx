import { HStack, Text, Icon, Button, IButtonProps } from 'native-base';
import { AntDesign  } from '@expo/vector-icons';



type Props = IButtonProps & {
    name?: string;
    title?: string;    
    isButtonLeft?: boolean;
    isButtonRight?: boolean;
    onFunctionLeft?: () => void; 
    onFunctionRight?: () => void;    
}


export function CardHeader({name, title, isButtonLeft, isButtonRight, onFunctionLeft, onFunctionRight, ...rest } : Props){
    return(
        <HStack 
            mt={16}
            bg='gray.600'
            justifyContent='center'
            alignItems='center'
            mb={4}  
        >
           
                <Text color='gray.100' fontFamily='heading' fontSize='lg'>{title}</Text>
            

            {
                isButtonLeft ? 
                <Button
                    onPress={onFunctionLeft}
                    position='absolute'
                    left='4'                    
                    p={4}
                    bg='transparent'
                    _pressed={{
                        bg: 'gray.500',
                        rounded: '9999',                       
                    }}
                    {...rest}
                >
                    <Icon 
                        as={AntDesign }                    
                        name='arrowleft'
                        size='6'                    
                        color='gray.100'                    
                    />
                </Button>
                :
                false
            }
            
            

            {
                isButtonRight ? 
                <Button
                    onPress={onFunctionRight}
                    position='absolute'
                    right='4'
                    p={4}
                    bg='transparent'
                    _pressed={{
                        bg: 'gray.500',
                        rounded: '9999',                       
                    }}
                    
                    {...rest}
                >
                <Icon 
                    as={AntDesign }                    
                    name={name}
                    size='6'                    
                    color='gray.100'                   
                />
                </Button>
                :
                false
            }
            
        </HStack>
    );
}