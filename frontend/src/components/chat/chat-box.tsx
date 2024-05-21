import { UserType, useSession } from '@/providers/user-provider';
import { ChatMessage, MessageType } from './message';

export const ChatBox = ({ messages }: { messages: MessageType[] | undefined }) => {
  const { user } = useSession();

  if (!messages || !user) return null;

  console.log(user.id, messages);
  return (
    <div className='min-h-[calc(100%-91px)] flex flex-col overflow-y-scroll'>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} isMine={user.id === message.sender} />
      ))}
    </div>
  );
};
