import { Button } from "@/components/ui/button";
import { fetcherWithOptions } from "@/lib/fetchers";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { capitalize } from "@/lib/utils";


export const PrivacyBtn = ({ privacy_state }: { privacy_state: "public" | "private" }) => {
    const [privacyState, setPrivacyState] = useState(privacy_state);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            return fetcherWithOptions({url: '/api/users/me', method: 'PATCH', body: data })
        },
    });

    const handleClick = () => {
        const newPrivacyState = privacyState === "public" ? "private" : "public";
        setPrivacyState(newPrivacyState);
        mutation.mutate({ privacy: newPrivacyState });
    };

    return (
        <Button variant="outline" onClick={handleClick}>
            {capitalize(privacyState)}
        </Button>
    )
};