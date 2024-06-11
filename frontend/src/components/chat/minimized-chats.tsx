'use client';

import { MinimizedChat } from './minimized-chat';
import { useAppSelector } from '@/lib/hooks';
import { selectMinimizedChats } from '@/features/chats/chatsSlice';

export const MinimizedChats = () => {
  const minimizedChats = useAppSelector(selectMinimizedChats);

  return (
    <div className='fixed bottom-5 right-5 flex flex-col space-y-2'>
      {minimizedChats.map((chat) => (
        <MinimizedChat key={chat.id} chat={chat} />
      ))}
    </div>
  );
};
