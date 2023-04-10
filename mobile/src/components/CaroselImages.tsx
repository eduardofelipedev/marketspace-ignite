import { Image, View, Text  } from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import { api } from '../services/api';




export type Props = {
    data: [{
        id: string,
        path: string,          
    }];
    is_active?: boolean; 
}



export function CaroselImages({data, is_active} : Props){

    

    function renderSlides({item }: any){
        
        return(
           
            <View >
                <Image 
                    source={{uri: `${api.defaults.baseURL}/images/${item.path}`}}
                    alt='Imagem'
                    style={{
                        resizeMode: 'cover',
                        height: '100%',
                        width: '100%',                        
                    }}
                />
            </View>
            
        )
    }



    return(
        <View h='280' w='full' mt={4}>
            <AppIntroSlider             
                renderItem={renderSlides}
                data={data}
                style={{                    
                    height: '50%',                  
                }}
                activeDotStyle={{
                    width: '33.3%',
                    backgroundColor: '#D9D8DA' ,
                    marginBottom: -60,
                    height: 4
                }}
                dotStyle={{
                    width: '33.3%',
                    backgroundColor: '#F7F7F8',
                    marginBottom: -60,
                    height: 4               
                }}

                showNextButton={false}
                showDoneButton={false}

            />

            

            {
                is_active === false ? 
                <>
                    <View 
                        h='full' 
                        w='full'
                        bg='gray.100:alpha.60'
                        position='absolute'
                    />
                    <Text
                        position='absolute'
                        top='50%'
                        color='gray.700'
                        fontSize={14}
                        fontFamily='heading'                
                        w='full'
                        textAlign='center'                        
                    >
                        ANÚNCIO DESATIVADO
                    </Text>
                </>
                :
                undefined

            }
            
    </View>
    );
}