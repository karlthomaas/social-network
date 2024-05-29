import { MessageType } from '@/components/chat/message';
import { GroupType } from '@/app/(authenticated)/groups/page';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';
export interface getChatMessagesQuery {
  messages: MessageType[];
}

export interface getGroupsQuery {
  groups: GroupType[];
}

export interface getUserFollowersQuery {
  followers: FollowerType[];
}