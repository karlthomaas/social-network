import { getChatMessagesQuery, getGroupsQuery, getUserFollowersQuery } from '@/services/backend/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { formSchema, LoginFormProps } from '@/app/(unauthenticated)/login/_components/login-form';
import { RegisterFormProps } from '@/app/(unauthenticated)/register/_components/register-form';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendUrl}/api/`, credentials: 'include' }),
  tagTypes: ['Chat', 'Groups'],
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string }, RegisterFormProps>({
      query: (values) => {
        const { confirmPassword, ...rest } = values;
        return {
          url: 'users',
          method: 'POST',
          body: rest,
        };
      },
    }),

    login: builder.mutation<{ message: string }, LoginFormProps>({
      query: ({ email, password }) => ({
        url: 'login',
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${email}:${password}`) },
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
    }),
    getSessionUser: builder.query<any, null>({
      query: () => 'users/me',
    }),
    getUserFollowers: builder.query<getUserFollowersQuery, string>({
      query: (nickname: string) => `users/${nickname}/followers`,
    }),
    getSessionUserGroups: builder.query<getGroupsQuery, void>({
      query: () => 'groups/users/me',
      providesTags: ['Groups'],
      transformResponse: (response: any) => response.groups ? response :  { groups: [] },
    }),

    getChatMessages: builder.query<getChatMessagesQuery, string>({
      query: (chatId: string) => `messages/users/${chatId}`,
      providesTags: (result, error, args) => [{ type: 'Chat', id: args }],
    }),
    getGroupMessages: builder.query<getChatMessagesQuery, string>({
      query: (groupId: string) => `messages/groups/${groupId}`,
      providesTags: (result, error, args) => [{ type: 'Chat', id: args }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,

  useGetChatMessagesQuery,
  useGetUserFollowersQuery,
  useGetSessionUserGroupsQuery,
  useGetGroupMessagesQuery,
  useGetSessionUserQuery,
} = backendApi;
