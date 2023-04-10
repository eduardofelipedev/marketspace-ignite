import { Text, VStack, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';




export function Empty(){
    return(
        <VStack  justifyContent='center' alignItems='center' mt={24}>
            <Icon 
                as={AntDesign}
                name='tago'
                size={20}
                color='gray.400'
            />
            <Text
                fontFamily='body'
                fontSize={16}
                color='gray.300'
            >
                Nenhum anúncio encontrado!
            </Text>
        </VStack>
    );
}