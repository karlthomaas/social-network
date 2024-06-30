import { backendApi } from '@/services/backend/backendApi';

import type { EventType, FollowerType, GroupInvitationType, GroupType } from '@/services/backend/types';
import type { GroupFormProps } from '@/app/(authenticated)/groups/_components/group-modal';
import { EventFormProps } from '@/components/event/event-form';

export const extendedGroupsApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<{ groups: GroupType[] }, void>({
      query: () => 'groups',
      providesTags: ['Groups'],
    }),
    getGroupDetails: builder.query<{ group: GroupType }, string>({
      query: (groupId) => `groups/${groupId}`,
    }),
    getGroupMemberStatus: builder.query<any, string>({
      query: (groupId) => `groups/${groupId}/members`,
      providesTags: (result, error, args) => [{ type: 'Group', id: args }],
    }),
    getGroupRequestStatus: builder.query<any, string>({
      query: (groupId) => `groups/${groupId}/join-request-status`,
    }),
    getGroupEvents: builder.query<{ group_events: EventType[] }, string>({
      query: (groupId) => `groups/${groupId}/group_events`,
      providesTags: (result, error, args) => [{ type: 'Events', id: args }],
    }),
    getGroupJoinRequests: builder.query<any, string>({
      query: (groupId) => `groups/${groupId}/requests`,
      providesTags: (result, error, args) => [{ type: 'GroupJoinRequests', id: args }],
    }),
    getGroupInvitations: builder.query<{ invitations: GroupInvitationType[] }, string>({
      query: (groupId) => `groups/${groupId}/group_invitations`,
      providesTags: ['GroupInvitations'],
    }),
    getMyGroupInvitations: builder.query<{ invitations: GroupInvitationType[] }, string>({
      // Get my created group invitations
      query: (groupId) => `/groups/${groupId}/invitations`,
      providesTags: ['GroupInvitations'],
    }),
    getGroupInvitableUsers: builder.query<{ users: FollowerType[] }, string>({
      // Returns followers that are not in the group
      query: (groupId) => `groups/${groupId}/invitable_users`,
      providesTags: ['Followers', 'GroupInvitations'],
    }),
    getSessionUserGroups: builder.query<{ groups: GroupType[] }, void>({
      query: () => 'groups/users/me',
      providesTags: ['Groups'],
      transformResponse: (response: any) => (response.groups ? response : { groups: [] }),
    }),

    createGroupEvent: builder.mutation<any, EventFormProps>({
      query: ({ id, ...rest }) => ({
        url: `groups/${id}/group_events`,
        method: 'POST',
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Events', id }],
    }),
    createGroup: builder.mutation<{ group: GroupType }, GroupFormProps>({
      query: (values) => ({
        url: 'groups',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: ['Groups'],
    }),
    createGroupRequest: builder.mutation<any, string>({
      query: (groupId) => ({
        url: `groups/${groupId}/requests`,
        method: 'POST',
      }),
    }),
    createGroupUserInvitation: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/users/${userId}`,
        method: 'POST',
      }),
    }),
    deleteGroupJoinRequest: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/requests/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: 'GroupJoinRequests', id: groupId }],
    }),
    deleteGroupRequest: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/requests/users/${userId}`,
        method: 'DELETE',
      }),
    }),
    deleteGroupInvitation: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `groups/${groupId}/group_invitations`,
        method: 'DELETE',
      }),
    }),
    cancelGroupUserInvitation: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/group_invitations/users/${userId}/cancel`,
        method: 'DELETE',
      }),
    }),
    declineGroupUserInvitation: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/group_invitations/users/${userId}/decline`,
        method: 'DELETE',
      }),
    }),
    acceptGroupJoinRequest: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/requests/users/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: 'GroupJoinRequests', id: groupId }],
    }),
    acceptGroupInvitation: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `groups/${groupId}/group_invitations`,
        method: 'POST',
      }),
      invalidatesTags: ['Groups'],
    }),
    leaveGroup: builder.mutation<any, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `groups/${groupId}/members/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Groups'],
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
  }),
  overrideExisting: false,
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useGetGroupDetailsQuery,
  useGetGroupMemberStatusQuery,
  useGetGroupRequestStatusQuery,
  useGetGroupEventsQuery,
  useGetGroupJoinRequestsQuery,
  useGetGroupInvitationsQuery,
  useGetMyGroupInvitationsQuery,
  useGetGroupInvitableUsersQuery,
  useGetSessionUserGroupsQuery,

  useDeleteGroupJoinRequestMutation,
  useCreateGroupEventMutation,
  useAttendGroupEventMutation,
  useChangeGroupEventAttendanceMutation,
  useDeleteGroupInvitationMutation,
  useCreateGroupRequestMutation,
  useDeleteGroupRequestMutation,
  useLeaveGroupMutation,
  useAcceptGroupJoinRequestMutation,
  useAcceptGroupInvitationMutation,
  useCancelGroupUserInvitationMutation,
  useDeclineGroupUserInvitationMutation,
  useCreateGroupUserInvitationMutation,
} = extendedGroupsApi;
