import { PrivacyStates } from '@/app/(authenticated)/profile/[user]/_components/privacy';

import { backendApi } from '@/services/backend/backendApi';
import type { UserType } from '@/features/auth/types';
import type { FollowerType, GroupInvitationType, NotificationType } from '@/services/backend/types';

export const extendedUserApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessionUser: builder.query<any, null>({
      query: () => 'users/me',
    }),
    getUserFollowers: builder.query<{ followers: FollowerType[] }, string>({
      query: (nickname: string) => `users/${nickname}/followers`,
    }),
    updatePrivacy: builder.mutation<any, PrivacyStates>({
      query: (privacy) => ({
        url: 'users/me',
        method: 'PATCH',
        body: { privacy: privacy },
      }),
    }),
    getUserGroupInvitations: builder.query<{ invitations: GroupInvitationType[] }, string>({
      query: (userId) => `users/${userId}/group_invitations`,
      providesTags: ['GroupInvitations'],
    }),
    getUserDetails: builder.query<{ user: UserType }, string>({
      query: (userId) => `users/${userId}`,
    }),
    getUserNotifications: builder.query<{ notifications: NotificationType[] }, void>({
      query: () => 'notifications/me',
      providesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<any, string>({
      query: (notificationId) => ({ url: `notifications/${notificationId}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSessionUserQuery,
  useGetUserFollowersQuery,
  useUpdatePrivacyMutation,
  useGetUserGroupInvitationsQuery,
  useGetUserDetailsQuery,
  useGetUserNotificationsQuery,
  useDeleteNotificationMutation,
} = extendedUserApi;
