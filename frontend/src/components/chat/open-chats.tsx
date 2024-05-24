'use client';

import useWebSocket from 'react-use-websocket';
import { useChatStore } from '@/hooks/stores';
import { OpenChat } from './open-chat';
import React, { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface WebSocketMessage {
  receiver: string;
  message: string;
  group_id: string;
  type: string;
}

interface ReceivedWebSocketMessage {
  gropu_id: string;
  message: string;
  online: string;
  receiver: string;
  sender: string;
  type: string;
}

export const OpenChats = () => {
  const { sendMessage, lastMessage } = useWebSocket(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
  const queryClient = useQueryClient();

  const handleSendMessage = useCallback(
    (message: WebSocketMessage) => {
      sendMessage(JSON.stringify(message));
    },
    [sendMessage]
  );

  useEffect(() => {
    if (!lastMessage || !lastMessage.data) return;
    const message: ReceivedWebSocketMessage = JSON.parse(lastMessage.data);
    queryClient.refetchQueries({ queryKey: ['chat', message.sender] });
    
  }, [lastMessage, queryClient]);

  const openChats = useChatStore((state) => state.openChats);

  return (
    <div className='fixed bottom-0 right-[100px] flex space-x-2'>
      {openChats.map((chat) => (
        <OpenChat sendMessage={handleSendMessage} key={chat.id} user={chat} />
      ))}
    </div>
  );
};
