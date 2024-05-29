import { configureStore } from '@reduxjs/toolkit';
import { backendApi } from '@/services/backend/backendApi';

import chatsReducer from '@/features/chats/chatsSlice';
import authReducer from '@/features/auth/authSlice';

import { socketMiddleware } from './middlware/socket';
import { Socket } from './lib/socket';

export const makeStore = () => {
  return configureStore({
    reducer: {
      chat: chatsReducer,
      auth: authReducer,
      [backendApi.reducerPath]: backendApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(backendApi.middleware).concat(socketMiddleware(new Socket())),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
