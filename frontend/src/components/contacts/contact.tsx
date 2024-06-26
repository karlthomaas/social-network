'use client';

import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { openChat, selectOpenChats } from '@/features/chats/chatsSlice';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';

export const Contact = ({ id, name, type, image }: { id: string; name: string; type: 'private' | 'group'; image?: string | null }) => {
  const dispatch = useAppDispatch();
  const openChats = useAppSelector(selectOpenChats);

  const handleClick = () => {
    // Chat is open
    if (Object.values(openChats).some((chat) => chat.id === id)) return;

    dispatch(
      openChat({
        id,
        name,
        image,
        state: 'open',
        type,
        unreadMessages: 0,
      })
    );
  };

  return (
    <div onClick={handleClick} className='flex h-max min-h-[60px] w-full items-center p-2 pl-4 hover:cursor-pointer hover:bg-secondary/50'>
      <ProfilePicture url={image} className='mr-2 size-[45px]' />
      {name}
    </div>
  );
};
