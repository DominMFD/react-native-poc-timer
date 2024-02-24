import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtoProps = TouchableOpacityProps & {
    label: string
}

export default function Button({label, ...rest}: ButtoProps) {

    return (
        <TouchableOpacity 
        className="bg-slate-950 rounded-md items-center justify-center p-3"
        activeOpacity={0.8}
        {...rest}>
            <Text 
            className="text-lime-400 text-xl mx-5 font-bold">
            {label}
            </Text>
        </TouchableOpacity>
    )
}