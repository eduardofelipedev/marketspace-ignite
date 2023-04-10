import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORAGE } from "./storageConfig";



export async function storageAuthTokenSave(token: string){
    try{
        await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify(token));
    }catch(error){
        throw error;
    }
}


export async function storageAuthTokenGet(){
    const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);    
    const token = response ? JSON.parse(response) : {};    
    return token;
}

export async function storageTokenRemove(){
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}