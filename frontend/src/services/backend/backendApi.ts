import type { GetChatMessagesQuery, GetGroupsQuery, GetUserFollowersQuery, GroupType, MakePost, EventType, GroupInvitationType, FollowerType } from '@/services/backend/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginFormProps } from '@/app/(unauthenticated)/login/_components/login-form';
import { RegisterFormProps } from '@/app/(unauthenticated)/register/_components/register-form';
import { PostType } from '@/components/post/post';
import { ReactionType, ReplyType } from '@/components/post/replies';
import { ReplyFormProps } from '@/components/post/reply-input';
import { GroupFormProps } from '@/app/(authenticated)/groups/_components/group-modal';
import { PrivacyStates } from '@/app/(authenticated)/profile/[user]/_components/privacy';
import { EventFormProps } from '@/components/event/event-form';
import { UserType } from '@/features/auth/types';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendUrl}/api/`, credentials: 'include' }),
  tagTypes: ['Chat', 'Groups', 'Posts', 'GroupJoinRequests', 'Group', 'Events', 'Followers'],
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
    updatePrivacy: builder.mutation<any, PrivacyStates>({
      query: (privacy) => ({
        url: 'users/me',
        method: 'PATCH',
        body: { privacy: privacy },
      }),
    }),
    getUserGroupInvitations: builder.query<{ invitations: GroupInvitationType[] }, string>({
      query: (userId) => `users/${userId}/group_invitations`,
    }),
    getUserDetails: builder.query<{ user: UserType}, string>({
      query: (userId) => `users/${userId}`,
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
    getGroupPosts: builder.query<{group_posts: PostType[]}, string>({
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

    // Group ->
    createGroup: builder.mutation<{ group: GroupType }, GroupFormProps>({
      query: (values) => ({
        url: 'groups',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: ['Groups'],
    }),
    getGroups: builder.query<GetGroupsQuery, void>({
      query: () => 'groups',
      providesTags: ['Groups'],
    }),
    groupLeave: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/members/users/${userId}`,
        method: 'DELETE',
      }),
    }),
    groupDetails: builder.query<{ group: GroupType }, string>({
      query: (groupId) => `groups/${groupId}`,
    }),
    isGroupMember: builder.query<any, string>({
      query: (groupId) => `groups/${groupId}/members`,
      providesTags: (result, error, args) => [{ type: 'Group', id: args }],
    }),
    // Groups Join Requests ->
    groupRequestStatus: builder.query<any, string>({
      query: (groupId) => `groups/${groupId}/join-request-status`,
    }),
    createGroupRequest: builder.mutation<any, string>({
      query: (groupId) => ({
        url: `groups/${groupId}/requests`,
        method: 'POST',
      }),
    }),
    deleteGroupRequest: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/requests/users/${userId}`,
        method: 'DELETE',
      }),
    }),

    // Group Invitations ->
    createGroupUserInvitation: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/users/${userId}`,
        method: 'POST',
      }),
    }),
    deleteGroupUserInvitation: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/group_invitations/users/${userId}`,
        method: 'DELETE',
      }),
    }),
    getMyGroupInvitations: builder.query<{ invitations: GroupInvitationType[] }, string>({
      // Get my created group invitations
      query: (groupId) => `/groups/${groupId}/invitations`
    }),
    getGroupInvitableUsers: builder.query<{ users: FollowerType[] }, string>({
      // Returns followers that are not in the group
      query: (groupId) => `groups/${groupId}/invitable_users`,
      providesTags: ['Followers']
    }),

    // Group Join Requests ->
    groupJoinRequests: builder.query<any, string>({
      query: (groupId) => `groups/${groupId}/requests`,
      providesTags: (result, error, args) => [{ type: 'GroupJoinRequests', id: args }],
    }),
    acceptGroupJoinRequest: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/requests/users/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: 'GroupJoinRequests', id: groupId }],
    }),
    deleteGroupJoinRequest: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/requests/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: 'GroupJoinRequests', id: groupId }],
    }),
    getGroupInvitations: builder.query<{ invitations: GroupInvitationType[]}, string>({
      query: (groupId) => `groups/${groupId}/group_invitations`,
    }),
    acceptGroupInvitation: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `groups/${groupId}/group_invitations`,
        method: 'POST',
      }),
    }),
    deleteGroupInvitation: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `groups/${groupId}/group_invitations`,
        method: 'DELETE',
      }),
    }),

    // Group events ->
    getGroupEvents: builder.query<{ group_events: EventType[] }, string>({
      query: (groupId) => `groups/${groupId}/group_events`,
      providesTags: (result, error, args) => [{ type: 'Events', id: args }],
    }),
    createGroupEvent: builder.mutation<any, EventFormProps>({
      query: ({ id, ...rest }) => ({
        url: `groups/${id}/group_events`,
        method: 'POST',
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Events', id }],
    }),
    attendGroupEvent: builder.mutation<any, { groupId: string; eventId: string; attendance: number }>({
      query: ({ groupId, eventId, attendance }) => ({
        url: `groups/${groupId}/group_events/${eventId}/group_event_members`,
        method: 'POST',
        body: { attendance },
      }),
    }),
    changeGroupEventAttendance: builder.mutation<any, { groupId: string; eventId: string; attendance: number }>({
      query: ({ groupId, eventId, attendance }) => ({
        url: `groups/${groupId}/group_events/${eventId}/group_event_members`,
        method: 'PATCH',
        body: { attendance },
      }),
    }),

    // Followers ->
    getUserFollowStatus: builder.query<any, string>({
      query: (userId) => `users/${userId}/follow_status`,
    }),
    getUserFollowRequests: builder.query<{ requests: FollowerType[]}, string>({
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
  useUpdatePrivacyMutation,
  useGetUserGroupInvitationsQuery,
  useGetUserDetailsQuery,

  useGetGroupPostsQuery,
  useGetUserPostsQuery,
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

  useCreateGroupMutation,
  useGroupLeaveMutation,
  useGetGroupsQuery,
  useGroupDetailsQuery,
  useIsGroupMemberQuery,

  useGroupRequestStatusQuery,
  useCreateGroupRequestMutation,
  useDeleteGroupRequestMutation,
  useCreateGroupUserInvitationMutation,
  useDeleteGroupUserInvitationMutation,
  useGetMyGroupInvitationsQuery,
  useGetGroupInvitableUsersQuery,
  useAcceptGroupInvitationMutation,
  useDeleteGroupInvitationMutation,

  useGroupJoinRequestsQuery,
  useAcceptGroupJoinRequestMutation,
  useDeleteGroupJoinRequestMutation,
  useGetGroupInvitationsQuery,

  useGetGroupEventsQuery,
  useCreateGroupEventMutation,
  useAttendGroupEventMutation,
  useChangeGroupEventAttendanceMutation,

  useGetUserFollowStatusQuery,
  useGetUserFollowRequestsQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useDeleteFollowRequestMutation,
  useAcceptFollowRequestMutation,
} = backendApi;
