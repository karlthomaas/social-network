import { GroupInviteUser } from './group-invite-user';

import { useGetGroupInvitableUsersQuery, useGetMyGroupInvitationsQuery } from '@/services/backend/actions/groups';
import type { GroupInvitationType, FollowerType } from '@/services/backend/types';

export const GroupInviteContent = ({ groupId }: { groupId: string }) => {
  const usersQuery = useGetGroupInvitableUsersQuery(groupId);
  const invitationsQuery = useGetMyGroupInvitationsQuery(groupId);

  if (usersQuery.isError || invitationsQuery.isError) {
    return <p>Error</p>;
  }
  if (usersQuery.isLoading || invitationsQuery.isLoading || !usersQuery.data || !invitationsQuery.data) {
    return <p>Loading...</p>;
  }

  const { users } = usersQuery.data;
  const { invitations } = invitationsQuery.data;

  const invitedUserIds = invitations.map((invitation: GroupInvitationType) => invitation.user_id);
  return (
    <div className='flex flex-col space-y-5'>
      {users.map((follower: FollowerType, index: number) => (
        <GroupInviteUser key={index} isInvited={invitedUserIds.includes(follower.follower_id)} groupId={groupId} follower={follower} />
      ))}
    </div>
  );
};
