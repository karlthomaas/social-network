import { cn } from "@/lib/utils"

export const ProfilePicture = ({ className}: { className: string}) => {
    return <div className={cn(`w-[125px] z-20 aspect-square rounded-full bg-blue-900`, className)}/>
}