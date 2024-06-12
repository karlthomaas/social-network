import { backendApi } from '@/services/backend/backendApi';
import type { PostType } from '@/components/post/post';
import type { MakePost } from '@/services/backend/types';
import type { ReactionType } from '@/components/post/replies';
import { string } from 'zod';

const expandedPostsApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroupPosts: builder.query<{ group_posts: PostType[] }, string>({
      query: (groupId) => `groups/${groupId}/posts`,
      providesTags: (result, error, args) => [{ type: 'Posts', id: args }],
    }),
    getUserPosts: builder.query<{ posts: PostType[] }, string>({
      query: (userId) => `users/${userId}/posts`,
      providesTags: (result, error, args) => [{ type: 'Posts', id: args }],
    }),
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
    uploadImage: builder.mutation<{ url: string }, { option: string; id: string; data: FormData }>({
      query: ({ option, id, data }) => ({
        url: `images/${option}/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { option }) => option === 'users' ? [{ type: 'User' }]: [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGroupPostsQuery,
  useGetUserPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateGroupPostMutation,
  useGetFeedPostsQuery,
  useCreatePostReactionMutation,
  useDeletePostReactionMutation,
  useUploadImageMutation,
} = expandedPostsApi;
