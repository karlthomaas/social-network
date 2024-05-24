import { UserType } from '@/providers/user-provider';
import { create } from 'zustand';

interface ChatState {
  minChats: UserType[]; // minimized chats
  openChats: UserType[];

  openChat: (user: UserType) => void;
  closeChat: (user: UserType) => void;
  minimizeChat: (user: UserType) => void;
  reOpenChat: (user: UserType) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  minChats: [],
  openChats: [],

  openChat: (user) =>
    set((state) => ({
      openChats: [...state.openChats, user],
    })),
  closeChat: (user) =>
    set((state) => ({
      minChats: state.minChats.filter((u) => u.id !== user.id),
      openChats: state.openChats.filter((u) => u.id !== user.id),
    })),
  minimizeChat: (user) =>
    set((state) => ({
      openChats: state.openChats.filter((u) => u.id !== user.id),
      minChats: [...state.minChats, user],
    })),
  reOpenChat: (user) =>
    set((state) => ({
      minChats: state.minChats.filter((u) => u.id !== user.id),
      openChats: [...state.openChats, user],
    })),
}));
