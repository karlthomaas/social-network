import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { ChatType, closeChat, reOpenChat } from '@/features/chats/chatsSlice';
import { useAppDispatch } from '@/lib/hooks';
import React from 'react';

export const MinimizedChat = React.memo(({ chat }: { chat: ChatType }) => {
  const dispatch = useAppDispatch();

  // Private chat has two initials and group chat has one
  const chatName =
    chat.type === 'private'
      ? chat.name
          .split(' ')
          .map((name) => name[0])
          .join('')
      : chat.name[0];

  return (
    <div className='group relative h-max w-max'>
      {chat.image ? (
        <div onClick={() => dispatch(reOpenChat(chat.id))}>
          <ProfilePicture url={chat.image} className='size-12' />
        </div>
      ) : (
        <div
          onClick={() => dispatch(reOpenChat(chat.id))}
          className='flex size-12 items-center justify-center rounded-full border border-border bg-secondary/70 hover:cursor-pointer hover:bg-secondary'
        >
          {chatName.toUpperCase()}
        </div>
      )}
      <div
        onClick={() => dispatch(closeChat(chat.id))}
        className=' absolute -right-1 -top-2 hidden h-[20px] w-[20px] items-center justify-center rounded-full bg-primary/70 hover:cursor-pointer hover:bg-primary/80 group-hover:flex'
      >
        x
      </div>
    </div>
  );
});

MinimizedChat.displayName = 'MinimizedChat';
