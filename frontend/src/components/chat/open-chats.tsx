'use client';

import { useChatStore } from '@/hooks/stores';
import { OpenChat } from './open-chat';
import React from 'react';

export const OpenChats = () => {
  const openChats = useChatStore((state) => state.openChats);

  return (
    <div className='fixed bottom-0 right-[100px] flex space-x-2'>
      {openChats.map((chat) => (
        <OpenChat key={chat.id} user={chat} />
      ))}
    </div>
  );
};
