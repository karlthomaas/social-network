import { Oval } from "react-loader-spinner";

export const LoadingSpinner = ({ color="white", secondaryColor="#19202e", size=30 }: { color?: string, secondaryColor?: string,  size?:number}) => {
    return (
        <Oval
        secondaryColor={secondaryColor}
        color={color}
        height={size}
        width={size}
        strokeWidth={4}
        />
    );
};