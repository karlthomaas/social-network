'use client';

import { ChevronDown, SendHorizonal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { UserType } from '@/providers/user-provider';
import { ChatBox } from '@/components/chat/chat-box';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/hooks/stores';
import { Textarea } from '../ui/textarea';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { ChatMessage } from './message';
import { MessageType } from './message';

interface MessageQuery {
  messages: MessageType[];
}

export const OpenChat = React.memo(({ user }: { user: UserType }) => {
  const { sendMessage, lastMessage } = useWebSocket(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log('🚀 ~ OpenChat ~ lastMessage:', lastMessage);
  }, [lastMessage]);

  const { data, isLoading } = useQuery<MessageQuery>({
    queryKey: ['chat', user.id],
    queryFn: async () => fetcher(`api/messages/users/${user.id}`),
  });

  const handleCloseChat = () => {
    useChatStore.getState().closeChat(user);
  };

  const handleMinimizeChat = () => {
    useChatStore.getState().minimizeChat(user);
  };

  const handleSendMessage = () => {
    const message = {
      receiver: user.id,
      message: input,
      group_id: '',
      type: 'private_message',
    };

    sendMessage(JSON.stringify(message));
    setInput('');
  };

  return (
    <div className='h-[350px] w-[300px] rounded-lg rounded-b-none border border-border bg-background'>
      <div className='flex h-[50px] w-full items-center justify-between border-b border-border px-2 '>
        <h3>
          {user.first_name} {user.last_name}
        </h3>
        <div>
          <Button size='icon' variant='ghost' onClick={handleMinimizeChat}>
            <ChevronDown />
          </Button>
          <Button size='icon' variant='ghost' onClick={handleCloseChat}>
            <X />
          </Button>
        </div>
      </div>
      <div className='h-[calc(100%-91px)]'>
        <ChatBox messages={data?.messages} />
      </div>
      <div className='flex w-full space-x-2 px-1'>
        <div className='relative w-[calc(100%-50px)]'>
          <Textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder='Type a message'
            className='flex h-max min-h-[20px] resize-none'
            rows={1}
          />
        </div>
        <Button onClick={handleSendMessage} disabled={input.length === 0} size='icon' variant='ghost'>
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
});
