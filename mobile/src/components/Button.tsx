import { Button as ButtonNativeBase, IButtonProps, Text, } from 'native-base';




type Props = IButtonProps & {
    title: string;
    variant?: 'default' | 'primary' | 'secondary';
}

export function Button({title, variant = 'default', ...rest} : Props) {
    return(
        <ButtonNativeBase 
            w='full'
            h={12}          
            bg={variant === 'default' ? 'blue.500' : variant === 'primary' ? 'gray.100' : 'gray.500'}
            _pressed={{
                bg: variant === 'default' ? 'blue.700' : variant === 'primary' ? 'gray.200' : 'gray.400',
                
            }}
            alignItems='center'
            rounded={8}
            
            {...rest}

        >         
            
                <Text
                    fontFamily='heading'
                    color={variant === 'default' ? 'white' : variant === 'primary' ? 'white' : 'gray.200'}
                    fontSize='sm'                
                >                    
                    {title}
                </Text>
           
                
        </ButtonNativeBase>
    );
}