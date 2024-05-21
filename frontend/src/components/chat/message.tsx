interface ChatMessageProps {
  message: Message;
  isMine: boolean;
}

interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  group_id: string;
  created_at: string;
}

export const ChatMessage = ({ message, isMine }: ChatMessageProps) => {
  return <div></div>;
};
