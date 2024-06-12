import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserFollowersQuery } from '@/services/backend/actions/user';

export const FollowersCount = ({ username }: { username: string }) => {
  const { data, isLoading, isError } = useGetUserFollowersQuery(username);

  if (isLoading) {
    return <Skeleton className='h-[40px] w-[150px] -mt-7' />;
  }

  return <h3 className='text-white -mt-7'>{data?.followers.length || 0} <span className="text-neutral-400">Followers</span></h3>;
};
