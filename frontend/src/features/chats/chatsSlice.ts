import { RootState } from '../../store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

// https://redux-toolkit.js.org/tutorials/typescript

export interface ChatType {
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
    closeChat: (state, action: PayloadAction<string>) => {
      delete state.chats[action.payload];
    },
    minimizeChat: (state, action: PayloadAction<string>) => {
      state.chats[action.payload].state = 'minimized';
    },
    reOpenChat: (state, action: PayloadAction<string>) => {
      state.chats[action.payload].state = 'open';
    },
  },
});

export const { openChat, closeChat, minimizeChat, reOpenChat } = chatsSlice.actions;

export const selectChats = (state: RootState) => state.chat.chats;

export const selectOpenChats = createSelector(
  [selectChats],
  (chats) => Object.values(chats).filter((chat) => chat.state === 'open')
);

export const selectClosedChats = createSelector(
  [selectChats],
  (chats) => Object.values(chats).filter((chat) => chat.state === 'closed')
);

export const selectMinimizedChats = createSelector(
  [selectChats],
  (chats) => Object.values(chats).filter((chat) => chat.state === 'minimized')
);

export default chatsSlice.reducer;
