import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useAcceptFollowRequestMutation,
  useDeleteFollowRequestMutation,
  useGetUserFollowRequestsQuery,
} from '@/services/backend/backendApi';
import { FollowerType } from '@/services/backend/types';
import { Users2 } from 'lucide-react';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '../ui/use-toast';

export const FriendRequestsBtn = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useGetUserFollowRequestsQuery(userId);
  const [requests, setRequests] = useState<FollowerType[]>([]);
  const [acceptRequest] = useAcceptFollowRequestMutation();
  const [declineRequest] = useDeleteFollowRequestMutation();

  const handleCallback = async (id: string, action: boolean) => {
    try {
      if (action) {
        await acceptRequest(id).unwrap();
      } else {
        await declineRequest(id).unwrap();
      }
      setRequests((prev) => prev.filter((request) => request.follower_id !== id));
    } catch (error) {
      toast({
        title: 'Failed to process request',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (data?.requests) {
      setRequests(data.requests);
    }
  }, [data]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='relative'>
        {requests.length > 0 && <div className='absolute -right-2 -top-2 h-[20px] w-[20px] rounded-full bg-red-600'>{requests.length}</div>}
        <Users2 size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[350px]'>
        <DropdownMenuLabel>Friend requests</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading || isError || !data ? (
          <>Loading...</>
        ) : requests.length === 0 ? (
          <div className='p-4'>No friend requests</div>
        ) : (
          requests.map((request, index: number) => <FriendRequestItem key={index} callback={handleCallback} request={request} />)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FriendRequestItem = ({ request, callback }: { request: FollowerType; callback: (id: string, action: boolean) => {} }) => {
  return (
    <div className='flex h-[50px] items-center p-4'>
      <p>{request.user.nickname}</p>
      <div className='ml-auto flex space-x-2'>
        <Button size='icon' variant='ghost' onClick={() => callback(request.follower_id, true)}>
          <Check />
        </Button>
        <Button size='icon' variant='ghost' onClick={() => callback(request.follower_id, false)}>
          <X />
        </Button>
      </div>
    </div>
  );
};
