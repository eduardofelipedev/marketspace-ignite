import {Radio as NativeBaseRadio,} from 'native-base';

type Props = {
    value: string;
    title: string;
}


export function InputRadio({ value, title } : Props){
    return(
        <NativeBaseRadio value={value}>
            {title}
        </NativeBaseRadio>
    );
}