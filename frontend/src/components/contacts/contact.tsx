'use client';

import { openChat, selectOpenChats } from '@/features/chats/chatsSlice';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';

export const Contact = ({ id, name, type }: { id: string; name: string; type: 'private' | 'group' }) => {
  const dispatch = useAppDispatch();
  const openChats = useAppSelector(selectOpenChats);

  const handleClick = () => {
    // Chat is open
    if (Object.values(openChats).some((chat) => chat.id === id)) return;

    dispatch(
      openChat({
        id: id,
        name: name,
        state: 'open',
        type,
      })
    );
  };

  return (
    <div onClick={handleClick} className='flex h-[50px] w-full items-center p-4 hover:cursor-pointer hover:bg-secondary/50'>
      {name}
    </div>
  );
};
