import { fetcher } from '@/lib/fetchers';
import { useQuery } from '@tanstack/react-query';
import { GroupInviteUser } from './group-invite-user';

import { UserType } from '@/providers/user-provider';

export interface FollowerType {
  user_id: string;
  follower_id: string;
  created_at: string;
  user: UserType;
}

interface Invitation {
  group_id: string;
  invited_by: string;
  user_id: string;
}

export const GroupInviteContent = ({ group_id }: { group_id: string }) => {
  const usersQuery = useQuery({
    queryKey: ['friends'],
    queryFn: async () => fetcher(`/api/groups/${group_id}/invitable_users`),
  });

  const invitationsQuery = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => fetcher(`/api/groups/${group_id}/invitations`),
  });

  if (usersQuery.isError || invitationsQuery.isError) {
    return <p>Error</p>;
  } else if (usersQuery.isPending || invitationsQuery.isPending || !usersQuery.data || !invitationsQuery.data) {
    return <p>Loading...</p>;
  }

  const { user } = usersQuery.data;
  const { invitations } = invitationsQuery.data;

  const invitedUserIds = invitations.map((invitation: Invitation) => invitation.user_id);
  return (
    <div className='flex flex-col space-y-5'>
      {user.map((follower: FollowerType) => (
        <GroupInviteUser
          key={follower.user_id}
          isInvited={invitedUserIds.includes(follower.follower_id)}
          groupId={group_id}
          follower={follower}
        />
      ))}
    </div>
  );
};
