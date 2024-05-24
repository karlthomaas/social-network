import { UserType } from '@/providers/user-provider';
import clsx from 'clsx';

interface ChatMessageProps {
  message: MessageType;
  isMine: boolean;
}

export interface MessageType {
  id: string;
  sender: string;
  receiver: string;
  sender_user: UserType;
  receiver_user: UserType;
  message: string;
  group_id: string;
  created_at: string;
}

export const ChatMessage = ({ message, isMine }: ChatMessageProps) => {
  return (
    <div
      className={clsx('my-2 max-w-[90%] p-3 rounded-lg', {
        'bg-primary ml-auto': isMine,
        'bg-secondary mr-auto': !isMine,
      })}
    >
      {message.message}
    </div>
  );
};
