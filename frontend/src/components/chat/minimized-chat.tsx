import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { ChatType, closeChat, reOpenChat } from '@/features/chats/chatsSlice';
import { useAppDispatch } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
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
    <div className='group relative h-max w-max size-16'>
      {chat.image ? (
        <div onClick={() => dispatch(reOpenChat(chat.id))}>
          <ProfilePicture url={chat.image} className='size-16 hover:cursor-pointer' />
        </div>
      ) : (
        <div
          onClick={() => dispatch(reOpenChat(chat.id))}
          className='flex size-16 items-center justify-center rounded-full border border-border bg-secondary/70 hover:cursor-pointer hover:bg-secondary'
        >
          {chatName.toUpperCase()}
        </div>
      )}
      <div
        onClick={() => dispatch(closeChat(chat.id))}
        className='z-20 absolute -right-1 -top-2 hidden h-[25px] w-[25px] items-center justify-center rounded-full bg-secondary hover:cursor-pointer hover:bg-primary group-hover:flex'
      >
        <X size={15}/>
      </div>
      <div
        className={cn('z-20 absolute -left-1 -top-2 hidden h-[25px] w-[25px] items-center justify-center rounded-full bg-red-500 text-white text-[13px]', {
          flex: chat.unreadMessages !== 0,
        })}
      >
        {chat.unreadMessages}
      </div>
    </div>
  );
});

MinimizedChat.displayName = 'MinimizedChat';
