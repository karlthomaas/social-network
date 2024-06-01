import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserFollowersQuery } from '@/services/backend/actions/user';

export const FollowersCount = ({ username }: { username: string }) => {
  const { data, isLoading, isError } = useGetUserFollowersQuery(username);

  if (isLoading) {
    return <Skeleton className='h-[40px] w-[150px]' />;
  }

  return <h3 className='text-lg'>{data?.followers.length || 0} Followers</h3>;
};
