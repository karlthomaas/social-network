import { FollowListItem } from '@/app/(authenticated)/profile/[user]/_components/follow-user-item';
import { Dialog, DialogTrigger, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserFollowersQuery } from '@/services/backend/actions/user';

export const FollowersCount = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetUserFollowersQuery(username);

  if (isLoading) {
    return <Skeleton className='h-[30px] w-[100px]' />;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <h3 className='-mt-7 text-black dark:text-white'>
          {data?.data.followers.length || 0} <span className='text-neutral-500 dark:text-neutral-400'>Followers</span>
        </h3>
      </DialogTrigger>
      <DialogContent className='bg-card'>
        <DialogTitle>Followers List</DialogTitle>
        {data?.data.followers.length === 0 && <p className='text-neutral-500 dark:text-neutral-400'>User doesn't have followers</p>}
        {data?.data.followers.map((follower) => <FollowListItem key={follower.follower_id} follower={follower} />)}
      </DialogContent>
    </Dialog>
  );
};
