'use client';

import { ChevronDown, SendHorizonal, X } from 'lucide-react';
import React, { useState } from 'react';

import { UserType } from '@/providers/user-provider';
import { ChatBox } from '@/components/chat/chat-box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/hooks/stores';
import { Textarea } from '../ui/textarea';

export const OpenChat = React.memo(({ user }: { user: UserType }) => {
  const [input, setInput] = useState('');
  const handleCloseChat = () => {
    useChatStore.getState().closeChat(user);
  };

  const handleMinimizeChat = () => {
    useChatStore.getState().minimizeChat(user);
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

      <ChatBox user={user} />
      <div className='flex w-full space-x-2 px-1'>
        <div className='relative w-[calc(100%-50px)]'>
          <Textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder='Type a message'
            className='flex resize-none min-h-[20px] h-max'
            rows={1}
          />
          {/* <div
            onBlur={() => {
              if (input.length === 0) setInput('Write message here');
            }}
            onChange={(e) => console.log(e)}
            onFocus={() => setInput('')}
            contentEditable={true}
            className='absolute bottom-1 h-max max-h-[100px] min-h-[30px] w-full overflow-scroll rounded-lg border border-border pl-2 pt-1 text-sm outline-none'
            dangerouslySetInnerHTML={{ __html: input }}
          /> */}
        </div>
        <Button disabled={input.length === 0} size='icon' variant='ghost'>
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
});
