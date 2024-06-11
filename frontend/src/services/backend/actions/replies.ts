import { backendApi } from '../backendApi';
import type { ReactionType, ReplyType } from '@/components/post/replies';
import type { ReplyFormProps } from '@/components/post/reply-input';

const extendedRepliesApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
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
    createReplyReaction: builder.mutation<{ reaction: ReactionType }, { postId: string; replyId: string }>({
      query: ({ postId, replyId }) => ({
        url: `posts/${postId}/replies/${replyId}/reactions`,
        method: 'POST',
      }),
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
    deleteReplyReaction: builder.mutation<{ message: string }, { postId: string; replyId: string; reactionId: string }>({
      query: ({ postId, replyId, reactionId }) => ({
        url: `posts/${postId}/replies/${replyId}/reactions/${reactionId}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostRepliesQuery,
  useCreatePostReplyMutation,
  useUpdatePostReplyMutation,
  useDeletePostReplyMutation,
  useCreateReplyReactionMutation,
  useDeleteReplyReactionMutation,
} = extendedRepliesApi;
