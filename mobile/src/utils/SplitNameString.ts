export function SplitNameString(name: string){
    let nameString = name;
    let resultNameString = nameString.split(' ', 2);
    return resultNameString[0];
}