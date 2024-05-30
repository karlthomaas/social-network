import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '@/providers/user-provider';
import { RootState } from '@/store';
import { set } from 'date-fns';

interface PostType {
  view: number;
  postText: string;
  privacy: {
    value: string;
    visibleTo: string[];
  };

  isPending: boolean;
}

const initialState: PostType = {
  view: 0,
  postText: '',
  privacy: {
    value: 'public',
    visibleTo: [],
  },
  isPending: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    reset: (state) => {
      state.view = 0;
      state.postText = '';
      state.privacy.value = 'public';
      state.privacy.visibleTo = [];
      state.isPending = false;
    },
    increment: (state) => {
      state.view += 1;
    },
    deincrement: (state) => {
      state.view -= 1;
    },
    changeText: (state, action) => {
        state.postText = action.payload;
    },
    setPrivacy: (state, action) => {
        state.privacy.value = action.payload;
    },
    setPrivacyVisibleTo: (state, action) => {
        state.privacy.visibleTo = action.payload;
    },
  },
});

export const { reset, increment, deincrement, changeText, setPrivacy, setPrivacyVisibleTo } = postSlice.actions;

export const selectPrivacyValue = ( state: RootState ) => state.post.privacy.value;

export default postSlice.reducer;
