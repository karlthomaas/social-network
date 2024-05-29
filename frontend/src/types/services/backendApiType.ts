import { MessageType } from '@/components/chat/message';
import { GroupType } from '@/app/(authenticated)/groups/page';

export interface getChatMessagesQuery {
  messages: MessageType[];
}

export interface getGroupsQuery {
  groups: GroupType[];
}
