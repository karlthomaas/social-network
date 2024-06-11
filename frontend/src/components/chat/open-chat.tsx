'use client';

import { ChevronDown, SendHorizonal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatBox } from '@/components/chat/chat-box';
import { MessageType } from '@/components/chat/message';

import { useAppDispatch } from '@/lib/hooks';
import type { WebSocketMessage } from '@/middleware/socket';

import { useGetChatMessagesQuery, useGetGroupMessagesQuery } from '@/services/backend/actions/messages';
import { ChatType, closeChat, minimizeChat } from '@/features/chats/chatsSlice';

export const OpenChat = React.memo(({ chat, sendMessage }: { chat: ChatType; sendMessage: (message: WebSocketMessage) => void }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');

  const dispatch = useAppDispatch();

  const chatMessages = useGetChatMessagesQuery(chat.id, {
    skip: chat.type === 'group', // skip if chat is a group type
  });

  const groupMessages = useGetGroupMessagesQuery(chat.id, {
    skip: chat.type === 'private', // skip if chat is a private type
  });

  useEffect(() => {
    const data = chat.type === 'group' ? groupMessages.data : chatMessages.data;
    if (data) setMessages(data.messages);
  }, [chatMessages, groupMessages, chat.type]);

  const handleSendMessage = () => {
    sendMessage({
      receiver: chat.type === 'private' ? chat.id : '',
      message: input,
      group_id: chat.type === 'group' ? chat.id : '',
      type: chat.type === 'private' ? 'private_message' : 'group_message',
    });

    // update chat because backend doesn't return message object
    if (chat.type === 'private') {
      chatMessages.refetch();
    } else {
      groupMessages.refetch();
    }

    setInput('');
  };

  return (
    <div className='h-[350px] w-[300px] rounded-lg rounded-b-none border border-border bg-background'>
      <div className='flex h-[50px] w-full items-center justify-between border-b border-border px-2 '>
        <h3>{chat.name}</h3>
        <div>
          <Button size='icon' variant='ghost' onClick={() => dispatch(minimizeChat(chat.id))}>
            <ChevronDown />
          </Button>
          <Button size='icon' variant='ghost' onClick={() => dispatch(closeChat(chat.id))}>
            <X />
          </Button>
        </div>
      </div>
      <div className='h-[calc(100%-91px)]'>
        <ChatBox showHandles={chat.type === 'group'} messages={messages} />
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

OpenChat.displayName = 'OpenChat';
