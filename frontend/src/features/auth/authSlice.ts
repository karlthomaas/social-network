import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '@/features/auth/types';
import { backendApi } from '@/services/backend/backendApi';

interface AuthState {
  user: null | UserType;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(backendApi.endpoints.getSessionUser.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(backendApi.endpoints.getSessionUser.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addMatcher(backendApi.endpoints.getSessionUser.matchRejected, (state) => {
        state.user = null;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
