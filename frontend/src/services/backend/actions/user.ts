import { PrivacyStates } from '@/app/(authenticated)/profile/[user]/_components/privacy';

import { backendApi } from '@/services/backend/backendApi';
import type { UserType } from '@/features/auth/types';
import type { FollowerType, GroupInvitationType, NotificationType } from '@/services/backend/types';
import { profileFormType } from '@/app/(authenticated)/profile/[user]/_components/settings-form';

export const extendedUserApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ users: UserType[] }, string>({
      query: (nickname) => `users?search=${nickname}`,
    }),
    getSessionUser: builder.query<any, null>({
      query: () => 'users/me',
      providesTags: (result) => (result?.user ? [{ type: 'User', id: result.user.id }] : []),
    }),
    getUserFollowers: builder.query<{ data: { userId: string; followers: FollowerType[] } }, string>({
      query: (nickname: string) => `users/${nickname}/followers`,
      providesTags: (response) => [{ type: 'Followers', id: response?.data.userId }],
    }),
    getUserFollowing: builder.query<{ data: { userId: string; following: FollowerType[] } }, string>({
      query: (nickname: string) => `users/${nickname}/following`,
      providesTags: (response) => [{ type: 'Followers', id: response?.data.userId }],
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
      providesTags: (result, error, userId) => [{ type: 'User', id: result?.user.id }],
    }),
    getUserNotifications: builder.query<{ notifications: NotificationType[] }, void>({
      query: () => 'notifications/me',
      providesTags: ['Notification'],
    }),
    getContacts: builder.query<{ contacts: FollowerType[] }, void>({
      query: () => 'contacts/me',
      providesTags: ['Contacts'],
    }),
    deleteNotification: builder.mutation<any, string>({
      query: (notificationId) => ({ url: `notifications/${notificationId}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
    updateUser: builder.mutation<any, Omit<profileFormType, 'profile_picture'>>({
      query: (data) => ({
        url: 'users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result) => [{ type: 'User', id: result.user.id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useGetSessionUserQuery,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useUpdatePrivacyMutation,
  useGetUserGroupInvitationsQuery,
  useGetUserDetailsQuery,
  useGetUserNotificationsQuery,
  useGetContactsQuery,
  useDeleteNotificationMutation,
  useUpdateUserMutation,
} = extendedUserApi;
