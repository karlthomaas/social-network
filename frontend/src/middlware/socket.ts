import { MessageType } from '@/components/chat/message';
import { Socket } from '@/lib/socket';
import { backendApi } from '@/services/backend/backendApi';
import { WebSocketMessage } from '@/types/socket';

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
  switch (message.type) {
    case 'message':
      const messageData: MessageType = JSON.parse(message.data);
      const id = messageData.group_id ? messageData.group_id : messageData.sender;
      dispatch(backendApi.util.invalidateTags([{ type: 'Chat', id }]));
      break;

    default:
      break;
  }
};
