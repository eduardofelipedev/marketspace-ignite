import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base';


type Props = IInputProps & {
    errorMessage?: string | undefined;
}


export function Input({errorMessage = undefined, ...rest} : Props){
    const invalid = !!errorMessage;
    return(
        <FormControl isInvalid={invalid} mb={2}>
            <NativeBaseInput 
                bg='gray.700'
                h={12}
                px={8}
                borderWidth={0}
                fontSize='md'
                color='gray.200'
                fontFamily='body'
                placeholderTextColor='gray.400'
                rounded={6}
                _focus={{
                    bg: 'white',
                    borderWidth: 1,
                    borderColor: 'blue.500'
                }}
                isInvalid={invalid}
                _invalid={{
                    borderColor: 'red.500',
                    borderWidth: 1
                }}
                {...rest}
            />

            <FormControl.ErrorMessage>
                {errorMessage}
            </FormControl.ErrorMessage>
                
            
        </FormControl>
    );
}