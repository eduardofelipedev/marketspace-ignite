import {Box, Image, Text, View, VStack} from 'native-base';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ProductsDTO } from '../dtos/ProductsDTO';
import { api } from '../services/api';
import { FormatNumber } from '../utils/FormatNumber';




export type Props =  TouchableOpacityProps & {
    thumb: string; 
    isAvatar: boolean;
    data: ProductsDTO; 
    is_Active?: boolean;

}

export function CardAnnouncement({thumb, isAvatar = false, data, is_Active, ...rest} : Props){

    return(
        <TouchableOpacity {...rest}>
            <VStack   w={40} h={40} m={1.5}>            
                <Image 
                    source={{uri: `${thumb} `}} 
                    alt="image" 
                    rounded='14'
                    resizeMode='cover'
                    flex={1}
                />

                {
                    isAvatar ? 
                    <Image                
                        source={{uri: `${api.defaults.baseURL}/images/${data.user.avatar}`}}
                        size={8}
                        rounded='full'
                        position='absolute'                
                        top={1}
                        left={1}
                        alt='Image User'
                        borderWidth={1}
                        borderColor='white'                
                    />
                    : false
                }

                {
                    data.is_active === false ?
                    <>
                        <View 
                            bg='gray.100:alpha.60'
                            h='24'
                            w='full'
                            position='absolute'
                            rounded={14}
                        />

                        <Text
                            position='absolute'                                
                            color='gray.700'
                            fontSize={11}
                            fontFamily='heading'                
                            w='full'
                            left={4}
                            top='45%'                                
                        >
                            ANÚNCIO DESATIVADO
                        </Text>
                    </>
                    :
                    false
                }

                <Box
                    position='absolute'
                    top={1}
                    right={1}
                    bg={data.is_new ? 'blue.700' : 'gray.200'}
                    rounded={40}
                    px={2}
                    py={0.5}                
                >
                    <Text
                        color='white'
                        fontFamily='heading'
                        fontSize={12}
                    >
                        {data.is_new ? 'NOVO' : 'USADO'}
                    </Text>
                </Box>
                
                <VStack p={2}>            
                    <Text
                        color={data.is_active === false ? 'gray.400' : 'gray.200'}
                        fontFamily='body'
                        fontSize='14'
                        mb={1}
                        numberOfLines={1}
                    >
                        {data.name}
                    </Text>
                
                    <Text
                        fontFamily='heading'
                        fontSize='md'
                        color={data.is_active === false ? 'gray.400' : 'gray.100'}                    
                    >
                        R$ <Text fontFamily='heading' fontSize='22' color={data.is_active === false ? 'gray.400' : 'gray.100'}>{FormatNumber(data.price)}</Text>
                    </Text>               
                
                </VStack>
            </VStack>
        </TouchableOpacity>
    );
}