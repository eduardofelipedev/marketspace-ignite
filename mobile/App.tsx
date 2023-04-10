import { StatusBar } from 'expo-status-bar';

import { THEME  } from './src/theme';

import { useFonts, Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';

import { Roboto_700Bold } from '@expo-google-fonts/roboto';

import { NativeBaseProvider } from 'native-base';

import { Loading } from './src/components/Loading';


import { Routes } from './src/routes';
import { AuthContextProvider } from './src/contexts/AuthContexts';

export default function App() {
  const [fontsLoaded] = useFonts({Karla_400Regular, Karla_700Bold, Roboto_700Bold});  

  return (
    <NativeBaseProvider 
      theme={THEME}
      
    >      
      <StatusBar 
        backgroundColor='transparent'
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading /> }
      </AuthContextProvider>
      
    </NativeBaseProvider>
  );
}


