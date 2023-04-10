import { HStack, Button, IIconButtonProps, Text, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

type Props = IIconButtonProps & {
    title?: string;
    isIcon?: boolean;
}

export function CheckBox({title, isIcon, ...rest} : Props){
    return(
        <HStack alignItems='center' mb={2}>
            <Button p={0} size={4} mr={2}  rounded={6} color='white' {...rest}>                         

                <Icon 
                    as={AntDesign}
                    name='check'
                    color={isIcon ? 'white' : 'transparent'} 
                    size={3}               
                />                                     
                                
            </Button>
                <Text
                    fontFamily='body'
                    fontSize='16'
                    color='gray.200'
                >
                    {title}
                </Text>
        </HStack>
        
    );
}