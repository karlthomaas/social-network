import { Button } from "../ui/button"
import { ThumbsUp, MessageSquare, Forward  } from "lucide-react"

export const LikeButton = ({ postId }: { postId: string }) => {
    return (
        <Button variant='ghost' className="flex items-center space-x-4 w-full">
            <ThumbsUp  /> 
            <p>Like</p>
        </Button>
    )
}
export const CommentButton = () => {
    return (
        <Button variant='ghost' className="flex items-center space-x-4 w-full">
            <MessageSquare  /> 
            <p>Comment</p>
        </Button>
    )
}

export const ShareButton = ({ link }: { link: string }) => {
    return (
        <Button variant='ghost' className="flex items-center space-x-4 w-full">
            <Forward  /> 
            <p>Share</p>
        </Button>
    )
}   