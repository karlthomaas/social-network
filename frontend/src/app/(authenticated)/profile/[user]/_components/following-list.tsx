import { FollowListItem } from '@/app/(authenticated)/profile/[user]/_components/follow-user-item';
import { Dialog, DialogTrigger, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserFollowingQuery } from '@/services/backend/actions/user';

export const FollowingList = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetUserFollowingQuery(username);

  if (isLoading) {
    return <Skeleton className='h-[30px] w-[100px]' />;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <h3 className='-mt-7 text-black dark:text-white'>
          {data?.data.following.length || 0} <span className='text-neutral-500 dark:text-neutral-400'>Following</span>
        </h3>
      </DialogTrigger>
      <DialogContent className='bg-card'>
        <DialogTitle>Following list</DialogTitle>
        {data?.data.following.length === 0 ? (
          <p className='text-neutral-500 dark:text-neutral-400'>User doesn't follow anybody</p>
        ) : (
          data?.data.following.map((user) => <FollowListItem key={user.follower_id} follower={user} />)
        )}
      </DialogContent>
    </Dialog>
  );
};
