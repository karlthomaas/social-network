import { Button } from "../ui/button"
import { useMutation } from '@tanstack/react-query'
import { fetcherWithOptions } from "@/lib/fetchers"
import { useState } from "react"

export const FollowBtn = ({ className="", user_id, follow_state }: {className: string, user_id: string, follow_state: boolean}) => {
    const [followState, setFollowState] = useState(follow_state);

    const mutation = useMutation({
        mutationKey: ['follow'],
        mutationFn: async () => {
            return fetcherWithOptions({ url: `/api/users/${user_id}/follow`, method: 'POST', body: {} });
        },
        onMutate: () => {
            setFollowState(!followState);
        },
        onError: () => {
            setFollowState(followState);
        },
    })

    return (
        <Button className={className} variant='outline' onClick={() => mutation.mutate()}>
            { followState ? 'Follow' : 'Unfollow'}
        </Button>
    )
}