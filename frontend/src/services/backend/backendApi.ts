import { GetChatMessagesQuery, GetGroupsQuery, GetUserFollowersQuery, MakePost } from '@/services/backend/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginFormProps } from '@/app/(unauthenticated)/login/_components/login-form';
import { RegisterFormProps } from '@/app/(unauthenticated)/register/_components/register-form';
import { PostType } from '@/components/post/post';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendUrl}/api/`, credentials: 'include' }),
  tagTypes: ['Chat', 'Groups', 'Posts'],
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

    // User actions ->
    getSessionUser: builder.query<any, null>({
      query: () => 'users/me',
    }),
    getUserFollowers: builder.query<GetUserFollowersQuery, string>({
      query: (nickname: string) => `users/${nickname}/followers`,
    }),
    getSessionUserGroups: builder.query<GetGroupsQuery, void>({
      query: () => 'groups/users/me',
      providesTags: ['Groups'],
      transformResponse: (response: any) => (response.groups ? response : { groups: [] }),
    }),

    // Messages ->
    getChatMessages: builder.query<GetChatMessagesQuery, string>({
      query: (chatId: string) => `messages/users/${chatId}`,
      providesTags: (result, error, args) => [{ type: 'Chat', id: args }],
    }),
    getGroupMessages: builder.query<GetChatMessagesQuery, string>({
      query: (groupId: string) => `messages/groups/${groupId}`,
      providesTags: (result, error, args) => [{ type: 'Chat', id: args }],
    }),

    // Posts ->
    createPost: builder.mutation<{ post: PostType }, MakePost>({
      query: (post) => ({
        url: 'posts',
        method: 'POST',
        body: post,
      }),
    }),
    updatePost: builder.mutation<{ post: PostType }, MakePost>({
      query: ({ id, ...post }) => ({
        url: `posts/${id}`,
        method: 'PATCH',
        body: post,
      }),
    }),
    deletePost: builder.mutation<any, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),
    createGroupPost: builder.mutation<{ post: PostType }, MakePost>({
      query: ({ groupId, ...post }) => ({
        url: `groups/${groupId}/posts`,
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Posts'],
    }),
    getFeedPosts: builder.query<any, void>({
      query: () => 'posts/feed',
      providesTags: ['Posts'],
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

  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateGroupPostMutation,
  useGetFeedPostsQuery,
} = backendApi;
