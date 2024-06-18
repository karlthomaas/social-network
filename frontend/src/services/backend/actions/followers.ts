import { backendApi } from '@/services/backend/backendApi';
import type { FollowerType } from '@/services/backend/types';

const extendedFollowersApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserFollowStatus: builder.query<any, string>({
      query: (userId) => `users/${userId}/follow_status`,
    }),
    getUserFollowRequests: builder.query<{ requests: FollowerType[] }, string>({
      query: (userId) => `users/${userId}/follow_requests`,
      providesTags: ['FollowRequests'],
    }),
    followUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/followers`,
        method: 'POST',
      }),
      invalidatesTags: (r, e, userId) => [{ type: 'Followers', id: userId }, 'Contacts'],
    }),
    unfollowUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/followers`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, userId) => [{ type: 'Followers', id: userId }, 'Contacts'],
    }),
    cancelFollowRequest: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/follow_requests/cancel`,
        method: 'DELETE',
      }),
    }),
    deleteFollowRequest: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/follow_requests/decline`,
        method: 'DELETE',
      }),
    }),
    acceptFollowRequest: builder.mutation<any, string>({
      query: (userId) => ({
        url: `users/${userId}/follow_requests`,
        method: 'POST',
      }),
      invalidatesTags: ['Followers', 'Contacts'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserFollowStatusQuery,
  useGetUserFollowRequestsQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useCancelFollowRequestMutation,
  useDeleteFollowRequestMutation,
  useAcceptFollowRequestMutation,
} = extendedFollowersApi;
