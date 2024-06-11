import { MessageType } from '@/components/chat/message';
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
}

export const socketMiddleware = (socket: Socket) => (params: any) => (next: any) => (action: any) => {
  const { dispatch, getState } = params;
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
  if (data.type === 'private_message') {
    const id = data.group_id ? data.group_id : data.sender;
    dispatch(backendApi.util.invalidateTags([{ type: 'Chat', id }]));
  } else if (data.type === 'notification') {
    dispatch(backendApi.util.invalidateTags([{ type: 'Notification' }]));
  }
};
