import chatsSlice, { notifyChat } from '@/features/chats/chatsSlice';
import { Socket } from '@/lib/socket';
import { backendApi } from '@/services/backend/backendApi';

export interface WSPayload {
  sender?: string;
  receiver: string;
  message: string;
  group_id?: string;
  online?: string;
  type: 'private_message' | 'group_message' | 'notification';
  event_type?: 'group_request' | 'follow_request';

  name?: string;
  image?: string;
}

export const socketMiddleware = (socket: Socket) => (params: any) => (next: any) => (action: any) => {
  const { dispatch } = params;
  const { type } = action;

  switch (type) {
    case 'socket/connect':
      socket.connect(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
      socket.receive((message: MessageEvent) => handleSocketRecieve(message, dispatch));
      break;

    case 'socket/disconnect':
      socket.disconnect();
      break;

    case 'socket/send_message':
      socket.send(action.payload);
      break;

    default:
      break;
  }

  return next(action);
};

const handleSocketRecieve = (message: MessageEvent, dispatch: any) => {
  const data: WSPayload = JSON.parse(message.data);
  if (message.type !== 'message') return;

  if (data.type === 'private_message' || data.type === 'group_message') {
    const id = data.group_id ? data.group_id : data.sender;

    if (!id) return null;

    dispatch(backendApi.util.invalidateTags([{ type: 'Chat', id }]));

    if (!data.name) return null;

    dispatch(
      notifyChat({
        id,
        name: data.name,
        state: 'minimized',
        type: data.group_id ? 'group' : 'private',
        image: data.image,
        unreadMessages: 1,
      })
    );
  } else if (data.type === 'notification') {
    dispatch(backendApi.util.invalidateTags([{ type: 'Notification' }]));
  }
};
