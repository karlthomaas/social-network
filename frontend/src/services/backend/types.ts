import type { MessageType } from '@/components/chat/message';
import type { UserType } from '@/features/auth/types';
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

export interface GroupInvitationType {
  group_id: string;
  invited_by: string;
  user_id: string;
  created_at: string;
  user: UserType;
  group: GroupType;
}

export interface FollowerType {
  user_id: string;
  follower_id: string;
  created_at: string;
  user: UserType;
}

