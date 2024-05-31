import { MessageType } from '@/components/chat/message';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';
import { PostType } from '@/components/post/post';
import { UserType } from '@/providers/user-provider';
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

export interface GroupType {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface EventType {
  id: string;
  group_id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  user: UserType;
  group_event_member: {
    attendance: 0 | 1 | 2;
    user_id: string;
    group_event_id: string;
  };
  attendance: {
    going: number;
    not_going: number;
  };
}

export interface InvitationType {
  group_id: string;
  invited_by: string;
  user_id: string;
  created_at: string;
  user: UserType;
  group: GroupType;
}