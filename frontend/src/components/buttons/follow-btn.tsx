import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import {
  useDeleteFollowRequestMutation,
  useFollowUserMutation,
  useGetUserFollowStatusQuery,
  useUnfollowUserMutation,
} from '@/services/backend/backendApi';
import { toast } from '../ui/use-toast';
import { Skeleton } from '../ui/skeleton';

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
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [deleteFollowRequest] = useDeleteFollowRequestMutation();

  const [followStatus, setFollowStatus] = useState(0);
  const { data, isLoading } = useGetUserFollowStatusQuery(user_id);

  useEffect(() => {
    if (data?.permission) {
      setFollowStatus(data.permission);
    }
  }, [data]);

  const handleFollow = async () => {
    try {
      switch (followStatus) {
        case 0:
          const response = await followUser(user_id);
          setFollowStatus(response.data.privacy === 'public' ? 1 : 2);
          break;
        case 1:
          await unfollowUser(user_id);
          setFollowStatus(0);
          break;
        case 2:
          await deleteFollowRequest(user_id);
          setFollowStatus(0);
          break;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <Skeleton className='h-[40px] w-[100px]' />;
  }

  return (
    <Button className={className} variant='outline' onClick={handleFollow}>
      {translateFollowStatus(followStatus)}
    </Button>
  );
};
