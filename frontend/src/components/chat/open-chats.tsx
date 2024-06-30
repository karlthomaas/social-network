'use client';

import { OpenChat } from './open-chat';
import React, { useCallback, useEffect } from 'react';
import { selectOpenChats } from '../../features/chats/chatsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { WSPayload } from '@/middleware/socket';

export const OpenChats = () => {
  const dispatch = useAppDispatch();
  const openChats = useAppSelector(selectOpenChats);

  const { user } = useAppSelector((state) => state.auth);

  const handleSendMessage = useCallback(
    (message: WSPayload) => {
      dispatch({ type: 'socket/send_message', payload: message });
    },
    [dispatch]
  );

  return (
    <div className='fixed bottom-0 right-[100px] flex space-x-2'>
      {openChats.map((chat) => (
        <OpenChat sendMessage={handleSendMessage} key={chat.id} chat={chat} author={user} />
      ))}
    </div>
  );
};
