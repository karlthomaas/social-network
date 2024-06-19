import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import {
  useCancelFollowRequestMutation,
  useFollowUserMutation,
  useGetUserFollowStatusQuery,
  useUnfollowUserMutation,
} from '@/services/backend/actions/followers';
import { toast } from '../ui/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [cancelFollowRequest] = useCancelFollowRequestMutation();

  const [followStatus, setFollowStatus] = useState(0);
  const { refetch, data, isLoading } = useGetUserFollowStatusQuery(user_id);
  console.log('🚀 ~ FollowBtn ~ data:', data);

  useEffect(() => {
    if (data?.permission) {
      setFollowStatus(data.permission);
    }
  }, [data]);

  const handleFollow = async () => {
    try {
      switch (followStatus) {
        case 0:
          const response = await followUser(user_id).unwrap();
          setFollowStatus(response.privacy === 'public' ? 1 : 2);
          if (response.privacy === 'private' && user) {
            dispatch({
              type: 'socket/send_message',
              payload: {
                type: 'notification',
                receiver: user_id,
                message: `${user.first_name} ${user.last_name} requested to follow you!`,
                event_type: 'follow_request',
              },
            });
          }
          break;
        case 1:
          await unfollowUser(user_id).unwrap();
          setFollowStatus(0);
          break;
        case 2:
          await cancelFollowRequest(user_id).unwrap();
          setFollowStatus(0);
          break;
      }
      refetch();
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
