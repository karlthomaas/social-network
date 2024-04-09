import { Input } from "../ui/input";

export const Reply = ({ post }: { post: any }) => {
    return (
        <div className="h-max w-full flex space-x-5 mb-3">
            <div className="h-[40px] aspect-square rounded-full bg-secondary"/>
            <Input placeholder="Comment as John Doe" />
        </div>
    )
};