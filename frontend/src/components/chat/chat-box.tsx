import { useAppSelector } from '@/lib/hooks';
import { ChatMessage, MessageType } from './message';

export const ChatBox = ({ messages, showHandles = false }: { messages: MessageType[] | undefined; showHandles: boolean }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!messages || !user) return null;

  return (
    <div className='flex h-[255px] flex-col-reverse overflow-y-scroll pb-2'>
      {messages.map((message) => (
        <ChatMessage showHandle={showHandles} key={message.id} message={message} isMine={user.id === message.sender} />
      ))}
    </div>
  );
};
