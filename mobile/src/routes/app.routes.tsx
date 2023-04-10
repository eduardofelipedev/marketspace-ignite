import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


import {Icon, useTheme } from 'native-base';

import { Home } from '../screens/Home';
import { MyAds } from '../screens/MyAds';
import { EditAd } from '../screens/EditAd';
import { Details } from '../screens/Details';
import { Createads } from '../screens/CreateAds';
import { AdPreviews } from '../screens/AdPreviews';
import { DetailsMyAds } from '../screens/DetailsMyAds';
import { Platform} from 'react-native';

import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';




type AppRoutes = {
    home: undefined;
    myads: undefined;
    detailsMyAds: {adId: string},
    editad: {adId: string};
    details: {adId: string};
    createads: undefined;
    adpreviews: undefined;
    logout: undefined;
}



export type AppNavigationRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();


export function AppRoutes(){


    const { signOut} = useAuth();

    const { sizes, colors } = useTheme();
    const iconSize = sizes[2]; 

    return(
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.gray[200], 
                tabBarInactiveTintColor: colors.gray[400],              
                                
                tabBarStyle:{
                    backgroundColor: colors.white,
                    borderTopWidth: 0,
                    height: Platform.OS === 'android' ? 'auto' : 96,
                    paddingBottom: 40,
                    paddingTop: 40,                   
                    
                },               
                
                
            }}
        >
            <Screen 
                name='home'
                component={Home}                
                options={{                   
                    tabBarIcon: ({color}) => (
                        <Icon 
                            as={AntDesign}
                            name='home'
                            size={iconSize}
                            color={color}
                        />                        
                    ),
                    
                }}
                                
            />

            <Screen 
                name='myads'
                component={MyAds}
                options={{                   

                    tabBarIcon: ({color}) => (
                        <Icon 
                            as={AntDesign}
                            name='tago'
                            size={iconSize}
                            color={color}
                        />                        
                    )                    

                }}                
            />


            <Screen 
                name='details'
                component={Details}                
                options={{
                    tabBarButton: () => null,
                    tabBarStyle: {
                        display: 'none',
                    }
                }}          
            />

            <Screen 
                name='detailsMyAds'
                component={DetailsMyAds}                
                options={{
                    tabBarButton: () => null,
                    tabBarStyle: {
                        display: 'none',
                    }
                }}          
            />


            <Screen 
                name='createads'
                component={Createads}                
                options={{
                    tabBarButton: () => null,
                    tabBarStyle: {
                        display: 'none',
                    }
                }}          
            />

            <Screen 
                name='adpreviews'
                component={AdPreviews}                
                options={{
                    tabBarButton: () => null,
                    tabBarStyle: {
                        display: 'none',
                    }
                }}          
            />

            <Screen 
                name='editad'
                component={EditAd}                
                options={{
                    tabBarButton: () => null,
                    tabBarStyle: {
                        display: 'none',
                    }
                }}          
            />

            <Screen 
                name='logout'
                component={Home}
                listeners={{
                    tabPress: (e) => {                      
                      signOut();
                    },
                  }}
                
                options={{
                    tabBarIcon: ({color}) => (
                        <Icon 
                            as={MaterialIcons}
                            name='logout'
                            size={iconSize}
                            color='red.500'
                        />

                    )
                    
                }}                
            />
        </Navigator>
    );
}
