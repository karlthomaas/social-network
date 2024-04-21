import { Button } from '../ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetcher, fetcherWithOptions } from '@/lib/fetchers';
import { Skeleton } from '../ui/skeleton';
import { useEffect } from 'react';
import { create } from 'zustand';

const useStore = create((set) => ({
  followStatus: 0,
  setFollowStatus: (status: number) => set({ followStatus: status }),
}));

const translateFollowStatus = (permission: number) => {
  if (permission === 0) {
    return 'Follow';
  } else if (permission === 1) {
    return 'Unfollow';
  } else {
    return 'Requested';
  }
};

export const FollowBtn = ({ className = '', user_id }: { className?: string; user_id: string }) => {
  const followStatus: number = useStore((state: any) => state.followStatus);

  const { data, isLoading } = useQuery({
    queryKey: ['followStatus'],
    queryFn: async () => fetcher(`/api/users/${user_id}/follow_status`),
  });

  useEffect(() => {
    if (data) {
      useStore.setState({ followStatus: data.permission });
    }
  }, [data]);

  const mutation = useMutation({
    mutationKey: ['follow'],
    mutationFn: async () => {
      const options: {
        [key: number]: { url: string; method: string; body: any };
      } = {
        0: { url: `/api/users/${user_id}/follow`, method: 'POST', body: {} },
        1: { url: `/api/users/${user_id}/followers`, method: 'DELETE', body: {} },
        2: { url: `/api/users/${user_id}/follow_requests`, method: 'DELETE', body: {} },
      };

      return fetcherWithOptions(options[followStatus]);
    },
    onSuccess: (data: any) => {
      // When user was already following or requested to follow -> Reset to permission 0
      if (followStatus === 1 || followStatus === 2) {
        useStore.setState({ followStatus: 0 });
        return;
      }

      if (data.privacy === 'public') {
        useStore.setState({ followStatus: 1 });
      } else {
        useStore.setState({ followStatus: 2 });
      }
    },
  });

  if (isLoading) {
    return <Skeleton className='h-[40px] w-[100px]' />;
  }

  return (
    <Button className={className} variant='outline' onClick={() => mutation.mutate()}>
      {translateFollowStatus(followStatus)}
    </Button>
  );
};
