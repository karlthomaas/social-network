import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { backendApi } from '@/services/backend/backendApi';
import { RootState } from '@/store';

interface GroupType {
  role: 'owner' | 'member' | null;
  group: {
    id: string;
    user_id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
}

interface GroupState {
  groups: Record<string, GroupType>;
}

const initialState: GroupState = {
  groups: {},
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<GroupType>) => {
      state.groups[action.payload.group.id] = action.payload;
    },
    setRole: (state, action: PayloadAction<{ groupId: string; role: 'owner' | 'member' | null}>) => {
      state.groups[action.payload.groupId].role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(backendApi.endpoints.groupDetails.matchFulfilled, (state, action) => {
      state.groups[action.payload.group.id] = { group: action.payload.group, role: null };
    });
  },
});

export const { setGroup, setRole } = groupsSlice.actions;

export const selectRole = (state: RootState, groupId: string) => state.groups.groups[groupId]?.role;

export default groupsSlice.reducer;
