import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '@/features/auth/types';
import { extendedUserApi } from '@/services/backend/actions/user';
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
      .addMatcher(extendedUserApi.endpoints.getSessionUser.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(extendedUserApi.endpoints.getSessionUser.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addMatcher(extendedUserApi.endpoints.getSessionUser.matchRejected, (state) => {
        state.user = null;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
