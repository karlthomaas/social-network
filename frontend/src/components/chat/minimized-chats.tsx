'use client';

import { useChatStore } from '@/hooks/stores';
import { MinimizedChat } from './minimized-chat';

export const MinimizedChats = () => {
  const minimizedChats = useChatStore((state) => state.minChats);

  return (
    <div className='fixed bottom-5 right-5 flex flex-col space-y-2'>
      {minimizedChats.map((chat) => (
        <MinimizedChat key={chat.id} user={chat} />
      ))}
    </div>
  );
};
