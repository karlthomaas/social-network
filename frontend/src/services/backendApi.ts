import { getChatMessagesQuery, getGroupsQuery } from '@/types/services/backendApiType';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendUrl}/api/`, credentials: 'include' }),
  tagTypes: ['Chat', 'Groups'],
  endpoints: (builder) => ({
    getSessionUserGroups: builder.query<getGroupsQuery, void>({
      query: () => 'groups/users/me',
      providesTags: ['Groups'],
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

export const { useGetChatMessagesQuery, useGetSessionUserGroupsQuery, useGetGroupMessagesQuery } = backendApi;
