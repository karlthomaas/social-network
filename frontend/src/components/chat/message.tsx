import { UserType } from '@/providers/user-provider';
import clsx from 'clsx';

interface ChatMessageProps {
  message: MessageType;
  isMine: boolean;
  showHandle: boolean;
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

export const ChatMessage = ({ message, isMine, showHandle = false }: ChatMessageProps) => {
  const handle = showHandle ? (
    <h1 className={clsx('text-xs text-gray-400', { 'ml-auto pr-2': isMine, 'pl-1': !isMine })}>
      {isMine ? 'You' : `${message.sender_user.first_name}`}
    </h1>
  ) : null;

  return (
    <div
      className={clsx('my-2 max-w-[90%]', {
        'mt-3 flex flex-col space-y-1': showHandle,
        'ml-auto' : isMine,
        'mr-auto': !isMine,
      })}
    >
      {handle}
      <div
        className={clsx('p-3 rounded-lg', {
          'bg-primary rounded-r-none': isMine,
          'bg-secondary rounded-l-none': !isMine,
        })}
      >
        {message.message}
      </div>
    </div>
  );
};
