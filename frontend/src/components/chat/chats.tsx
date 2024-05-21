"use client";

import { create } from "zustand";
import { UserType } from "@/providers/user-provider";
import { Chat } from "./chat";

interface ChatState {
    chats: UserType[];
    addChat: (chat: UserType) => void;
    removeChat: (chatId: string) => void;
}

export const chatStore = create<ChatState>((set) => ({
    chats: [],
    addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
    removeChat: (chatId) => set((state) => ({ chats: state.chats.filter((chat) => chat.id !== chatId) })),
}));

export const Chats = () => {
    const chats = chatStore((state) => state.chats);

    if (chats.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 right-0 flex flex-row space-x-5">
            {chats.reverse().map((chat) => (
                <Chat key={chat.id} chat={chat} />
            ))}
        </div>
    );
};