import { UserType } from '@/providers/user-provider';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, X } from 'lucide-react';
import clsx from 'clsx';
import { Input } from '../ui/input';

export const Chat = ({ chat }: { chat: UserType }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='mt-auto flex w-[300px] flex-col rounded-lg rounded-b-none border-border bg-background'>
      <div className='flex h-[50px] w-full items-center justify-between rounded-lg border border-border bg-background p-2'>
        <h3>{chat.first_name}</h3>
        <div className='flex space-x-2'>
          <Button onClick={() => setIsOpen(!isOpen)} size='icon' variant='ghost'>
            <ChevronDown
              className={clsx('rotate-180 transition-all duration-150 ease-in-out', {
                'rotate-0': isOpen,
              })}
            />
          </Button>
          <Button size='icon' variant='ghost'>
            <X />
          </Button>
        </div>
      </div>
      <div
        className={clsx('h-[0px] border-border bg-background transition-all duration-150 ease-in-out', {
          'h-[300px] border ': isOpen,
        })}
      >
        <div id='messages'></div>
        {/* <Input className='mt-auto' placeholder='Type a message...' /> */}
      </div>
    </div>
  );
};
