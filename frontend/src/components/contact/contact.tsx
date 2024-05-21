"use client";

import { chatStore } from "../chat/chats";

export const Contact = ({ id, firstName, lastName }: { id: string, firstName: string, lastName: string }) => {
    const addChat = chatStore((state) => state.addChat);

    const handleClick = () => {
        addChat({
            id, first_name: firstName, last_name: lastName,
            about_me: "",
            date_of_birth: "",
            email: "",
            nickname: "",
            privacy: "",
            image: null
        });
    };

    return (
        <div onClick={handleClick} className="h-[75px] w-full rounded-xl flex space-x-4 p-2 items-center hover:bg-secondary/40 hover:cursor-pointer">
            <span className="size-[40px] rounded-full bg-secondary" />
            <h3>
                {firstName} {lastName}
            </h3>
        </div>
    )
};
