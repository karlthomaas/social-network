import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { InviteButton } from './buttons';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { UserType, useSession } from '@/providers/user-provider';
import { GroupInviteUser } from './group-invite-user';

export interface FollowerType {
  user_id: string;
  follower_id: string;
  created_at: string;
  user: UserType;
}

export const GroupInvite = ({ group_id }: { group_id: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => fetcher(`/api/groups/${group_id}/invitable_users`),
  });

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError || !data.user) {
    content = <div>Error</div>;
  } else if (data.user.length === 0) {
    content = <div>No friends to invite</div>;
  } else {
    content = data.user.map((follower: FollowerType) => {
      return <GroupInviteUser key={follower.follower_id} group_id={group_id} follower={follower} />;
    });
  }

  return (
    <Dialog>
      <DialogTrigger>
        <InviteButton />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Invite friends to Group</DialogHeader>
        <div className='flex flex-col space-y-5'>{content}</div>
      </DialogContent>
    </Dialog>
  );
};
