'use client';

import { UserType } from '@/providers/user-provider';
import { useChatStore } from '@/hooks/stores';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';

export const Contact = ({ follower }: { follower: FollowerType }) => {
  const user = follower.user;
  user.id = follower.follower_id;

  const handleClick = () => {
    // check if the user is already in the open chats
    const openChats = useChatStore.getState().openChats;
    const isChatOpen = openChats.some((chat) => chat.id === user.id);

    if (isChatOpen) return;

    const minChats = useChatStore.getState().minChats;
    const isChatMinimized = minChats.some((chat) => chat.id === user.id);

    if (isChatMinimized) {
      useChatStore.getState().reOpenChat(user);
    } else {
      useChatStore.getState().openChat(user);
    }
  };

  return (
    <div onClick={handleClick} className='flex h-[50px] w-full items-center p-4 hover:cursor-pointer hover:bg-secondary/50'>
      {user.first_name} {user.last_name}
    </div>
  );
};
