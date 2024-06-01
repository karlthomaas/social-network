import { backendApi } from '@/services/backend/backendApi';
import type { MessageType } from '@/components/chat/message';

const extendedMessagesApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<{ messages: MessageType[] }, string>({
      query: (chatId: string) => `messages/users/${chatId}`,
      providesTags: (result, error, args) => [{ type: 'Chat', id: args }],
    }),
    getGroupMessages: builder.query<{ messages: MessageType[] }, string>({
      query: (groupId: string) => `messages/groups/${groupId}`,
      providesTags: (result, error, args) => [{ type: 'Chat', id: args }],
    }),
  }),
});

export const { useGetChatMessagesQuery, useGetGroupMessagesQuery } = extendedMessagesApi;
