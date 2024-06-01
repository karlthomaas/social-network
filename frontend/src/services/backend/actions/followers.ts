import { backendApi } from '@/services/backend/backendApi';
import type { FollowerType } from '@/services/backend/types';

const extendedFollowersApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserFollowStatus: builder.query<any, string>({
      query: (userId) => `users/${userId}/follow_status`,
    }),
    getUserFollowRequests: builder.query<{ requests: FollowerType[] }, string>({
      query: (userId) => `users/${userId}/follow_requests`,
    }),
    followUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/followers`,
        method: 'POST',
      }),
    }),
    unfollowUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/followers`,
        method: 'DELETE',
      }),
    }),
    deleteFollowRequest: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/follow_requests`,
        method: 'DELETE',
      }),
    }),
    acceptFollowRequest: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/follow_requests`,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserFollowStatusQuery,
  useGetUserFollowRequestsQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useDeleteFollowRequestMutation,
  useAcceptFollowRequestMutation,
} = extendedFollowersApi;
