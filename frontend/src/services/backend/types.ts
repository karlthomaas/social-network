import { MessageType } from '@/components/chat/message';
import { GroupType } from '@/app/(authenticated)/groups/page';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';
import { PostType } from '@/components/post/post';
export interface GetChatMessagesQuery {
  messages: MessageType[];
}

export interface GetGroupsQuery {
  groups: GroupType[];
}

export interface GetUserFollowersQuery {
  followers: FollowerType[];
}

export interface MakePost {
  id?: string;
  groupId?: string;
  content: string;
  privacy: string;
  visible_to: string[];
}

