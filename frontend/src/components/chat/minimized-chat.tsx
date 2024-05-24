import { useChatStore } from '@/hooks/stores';
import { UserType } from '@/providers/user-provider';
import React from 'react';

export const MinimizedChat = React.memo(({ user }: { user: UserType }) => {
  const handleOpenChat = () => {
    useChatStore.getState().reOpenChat(user);
  };
  const handleCloseChat = () => {
    useChatStore.getState().closeChat(user);
  };
  return (
    <div className='group relative h-max w-max'>
      <div
        onClick={handleOpenChat}
        className='flex size-12 items-center justify-center rounded-full border border-border bg-secondary/70 hover:cursor-pointer hover:bg-secondary'
      >
        {user.first_name[0]}
        {user.last_name[0]}
      </div>
      <div
        onClick={handleCloseChat}
        className=' absolute -right-1 -top-2 hidden h-[20px] w-[20px] items-center justify-center rounded-full bg-primary/70 hover:cursor-pointer hover:bg-primary/80 group-hover:flex'
      >
        x
      </div>
    </div>
  );
});
