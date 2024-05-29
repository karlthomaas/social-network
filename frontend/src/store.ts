import { configureStore } from '@reduxjs/toolkit';
import { backendApi } from '@/services/backendApi';

import chatsReducer from '@/features/chats/chatsSlice';
import { socketMiddleware } from './middlware/socket';
import { Socket } from './lib/socket';

export const makeStore = () => {
  return configureStore({
    reducer: {
      chat: chatsReducer,
      [backendApi.reducerPath]: backendApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(backendApi.middleware).concat(socketMiddleware(new Socket())),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
