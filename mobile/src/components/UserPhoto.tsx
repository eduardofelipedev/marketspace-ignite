import { AntDesign } from '@expo/vector-icons';
import { Image, IImageProps, Button, VStack, Icon, IButtonProps } from 'native-base';


type Props = IImageProps & IButtonProps & {
    size: number;
    isEdit?: boolean;
}



export function UserPhoto({size, isEdit = false, ...rest} : Props){
    return(
        <VStack>
        <Image 
            w={size}
            h={size}
            rounded='full'
            borderWidth={3}
            borderColor='blue.500'
            {...rest}
        />
        {
            isEdit ? 
            <Button 
                position='absolute'
                bottom={1}
                right={-4}
                bg={'blue.500'}
                rounded='full'
                h={10}
                w={10}
                startIcon={
                    <Icon as={AntDesign} name="edit" size="sm" />
                }
                {...rest}
            />
                
            :
            false
        }
        </VStack>

        
    );
}