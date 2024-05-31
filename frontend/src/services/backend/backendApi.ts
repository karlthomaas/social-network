import { GetChatMessagesQuery, GetGroupsQuery, GetUserFollowersQuery, MakePost } from '@/services/backend/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginFormProps } from '@/app/(unauthenticated)/login/_components/login-form';
import { RegisterFormProps } from '@/app/(unauthenticated)/register/_components/register-form';
import { PostType } from '@/components/post/post';
import { ReactionType, ReplyType } from '@/components/post/replies';
import { ReplyFormProps } from '@/components/post/reply-input';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendUrl}/api/`, credentials: 'include' }),
  tagTypes: ['Chat', 'Groups', 'Posts', 'JoinRequestStatus'],
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

    // Post Reactions ->
    createPostReaction: builder.mutation<{ reaction: ReactionType }, { postId: string }>({
      query: ({ postId }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
      }),
    }),
    deletePostReaction: builder.mutation<{ message: string }, { postId: string; reactionId: string }>({
      query: ({ postId, reactionId }) => ({
        url: `posts/${postId}/reactions/${reactionId}`,
        method: 'DELETE',
      }),
    }),

    // Post Replies ->
    getPostReplies: builder.query<any, string>({
      query: (postId) => `posts/${postId}/reply`,
    }),
    createPostReply: builder.mutation<{ reply: ReplyType }, ReplyFormProps>({
      query: (values) => {
        const { postId, ...rest } = values;
        return {
          url: `posts/${postId}/reply`,
          method: 'POST',
          body: rest,
        };
      },
    }),
    updatePostReply: builder.mutation<{ reply: ReplyType }, ReplyFormProps>({
      query: (values) => {
        const { postId, replyId, ...rest } = values;
        return {
          url: `posts/${postId}/reply/${replyId}`,
          method: 'PATCH',
          body: rest,
        };
      },
    }),
    deletePostReply: builder.mutation<{ message: string }, { postId: string; replyId: string }>({
      query: ({ postId, replyId }) => ({
        url: `posts/${postId}/reply/${replyId}`,
        method: 'DELETE',
      }),
    }),

    // Reply Reactions ->
    createReplyReaction: builder.mutation<{ reaction: ReactionType }, { postId: string; replyId: string }>({
      query: ({ postId, replyId }) => ({
        url: `posts/${postId}/replies/${replyId}/reactions`,
        method: 'POST',
      }),
    }),
    deleteReplyReaction: builder.mutation<{ message: string }, { postId: string; replyId: string; reactionId: string }>({
      query: ({ postId, replyId, reactionId }) => ({
        url: `posts/${postId}/replies/${replyId}/reactions/${reactionId}`,
        method: 'DELETE',
      }),
    }),

    // Groups ->
    groupRequestStatus : builder.query<any, string>({
      query: (groupId) => `groups/${groupId}/join-request-status`,
      providesTags: (result, error, args) => [{ type: 'JoinRequestStatus', id: args }],
    }),
    createGroupRequest: builder.mutation<any, string>({
      query: (groupId) => ({
        url: `groups/${groupId}/requests`,
        method: 'POST',
      }),
      // invalidatesTags: ['JoinRequestStatus'],
    }),
    deleteGroupRequest: builder.mutation<any, { groupId: string, userId: string}>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/requests/users/${userId}`,
        method: 'DELETE',
      }),
      // invalidatesTags: ['JoinRequestStatus'],
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

  useCreatePostReactionMutation,
  useDeletePostReactionMutation,

  useGetPostRepliesQuery,
  useCreatePostReplyMutation,
  useUpdatePostReplyMutation,
  useDeletePostReplyMutation,

  useCreateReplyReactionMutation,
  useDeleteReplyReactionMutation,

  useGroupRequestStatusQuery,
  useCreateGroupRequestMutation,
  useDeleteGroupRequestMutation,
} = backendApi;
