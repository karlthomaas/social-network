import { RootState } from '@/lib/store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// https://redux-toolkit.js.org/tutorials/typescript

interface ChatType {
  id: string;
  name: string;
  state: 'open' | 'closed' | 'minimized';
  type: 'group' | 'private';
}

interface ChatsState {
  chats: Record<string, ChatType>;
}

const initialState: ChatsState = {
  chats: {},
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    openChat: (state, action: PayloadAction<ChatType>) => {
      state.chats[action.payload.id] = action.payload;
    },
    closeChat: (state, action: PayloadAction<string>) => {},
    minimizedChat: (state, action: PayloadAction<string>) => {},
    reOpenChat: (state, action: PayloadAction<string>) => {},
  },
});

export const { openChat, closeChat, minimizedChat } = chatsSlice.actions;

export const selectOpenChats = (state: RootState) => Object.values(state.chat).filter((chat) => chat.state === 'open');

export const selectClosedChats = (state: RootState) => Object.values(state.chat).filter((chat) => chat.state === 'closed');

export const selectMinimizedChats = (state: RootState) => Object.values(state.chat).filter((chat) => chat.state === 'minimized');

export default chatsSlice.reducer;
