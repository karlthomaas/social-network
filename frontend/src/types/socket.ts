export interface ReceivedWebSocketMessage {
  group_id: string;
  message: string;
  online: string;
  receiver: string;
  sender: string;
  type: string;
}

export interface WebSocketMessage {
  receiver: string;
  message: string;
  group_id: string;
  type: string;
}
