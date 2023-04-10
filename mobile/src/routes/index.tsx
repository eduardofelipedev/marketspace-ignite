import { NavigationContainer } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';

import { Box } from 'native-base';




export function Routes(){

    const { user, isLoadingUserStorageData } = useAuth();

    if(isLoadingUserStorageData){
        return <Loading />;
    }

    return(
        <Box
            flex={1}
        >
            <NavigationContainer>
                {user.id ? <AppRoutes /> : <AuthRoutes />}
            </NavigationContainer>
        </Box>

    );
}