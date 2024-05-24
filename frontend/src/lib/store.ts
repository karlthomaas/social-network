import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from '@/lib/features/chats/chatsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      chat: chatsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
