import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { Skeleton } from '@/components/ui/skeleton';

export const FollowersCount = ({ username }: { username: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['followers'],
    queryFn: async () => fetcher(`/api/users/${username}/followers`),
  });

  if (isLoading) {
    return <Skeleton className='h-[40px] w-[150px]' />;
  }

  return <h3 className='text-lg'>{data.followers.length} Followers</h3>;
};
