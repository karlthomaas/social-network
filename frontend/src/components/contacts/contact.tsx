'use client';

import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { selectMinimizedChats, selectOpenChats } from '@/lib/features/chats/chatsSlice';

export const Contact = ({ follower }: { follower: FollowerType }) => {
  const user = follower.user;
  user.id = follower.follower_id;

  const openChats = useAppSelector(selectOpenChats);
  const minimizedChats = useAppSelector(selectMinimizedChats);
  
  const handleClick = () => {
    console.log(openChats);
    const isChatOpen = Object.values(openChats).some((chat) => chat.id === user.id);

    if (isChatOpen) return;

    const isChatMinimized = minimizedChats.some((chat) => chat.id === user.id);

    if (isChatMinimized) {
    //   useChatStore.getState().reOpenChat(user);
    } else {
      useAppDispatch();
    //   useChatStore.getState().openChat(user);
    }
  };

  return (
    <div onClick={handleClick} className='flex h-[50px] w-full items-center p-4 hover:cursor-pointer hover:bg-secondary/50'>
      {user.first_name} {user.last_name}
    </div>
  );
};
