import { TextArea as NativeBaseTextArea, ITextAreaProps} from 'native-base';

type Props = ITextAreaProps & {

}

export function TextArea({...rest} : Props){
    return(
        <NativeBaseTextArea 
            autoCompleteType={undefined}
            h={24}
            bg='gray.700'
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
                {...rest}
        />

      
    );
}