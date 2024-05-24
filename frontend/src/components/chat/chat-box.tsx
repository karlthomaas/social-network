import { UserType, useSession } from '@/providers/user-provider';
import { ChatMessage, MessageType } from './message';

export const ChatBox = ({ messages }: { messages: MessageType[] | undefined }) => {
  const { user } = useSession();

  if (!messages || !user) return null;

  return (
    <div className='h-[255px] flex flex-col-reverse overflow-y-scroll'>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} isMine={user.id === message.sender} />
      ))}
    </div>
  );
};
