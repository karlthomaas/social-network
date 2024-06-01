import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { backendApi } from '@/services/backend/backendApi';

import chatsReducer from '@/features/chats/chatsSlice';
import authReducer from '@/features/auth/authSlice';
import postReducer from '@/features/post/postSlice';
import groupsReducer from '@/features/groups/groupsSlice';

import { socketMiddleware } from './middleware/socket';
import { Socket } from './lib/socket';


const appReducer = combineReducers({
  chat: chatsReducer,
  auth: authReducer,
  post: postReducer,
  groups: groupsReducer,
  [backendApi.reducerPath]: backendApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    // reset the state of a redux store on logout
    state = undefined;
  }

  return appReducer(state, action);
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(backendApi.middleware).concat(socketMiddleware(new Socket())),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
