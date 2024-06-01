// authMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { extendedUserApi } from '@/services/backend/actions/user';

export const authMiddleware: Middleware = (api) => (next) => (action) => {
  const result = next(action);

  if (extendedUserApi.endpoints.getSessionUser.matchPending(action)) {
    api.dispatch({ type: 'auth/setLoading', payload: true });
  } else if (extendedUserApi.endpoints.getSessionUser.matchFulfilled(action)) {
    api.dispatch({ type: 'auth/login', payload: action.payload.user });
    api.dispatch({ type: 'auth/setLoading', payload: false });
  } else if (extendedUserApi.endpoints.getSessionUser.matchRejected(action)) {
    api.dispatch({ type: 'auth/logout' });
    api.dispatch({ type: 'auth/setLoading', payload: false });
  }

  return result;
};
