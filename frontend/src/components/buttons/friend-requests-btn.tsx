import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetcher, fetcherWithOptions } from '@/lib/fetchers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Users2 } from 'lucide-react';
import { Check, X } from 'lucide-react';

export const FriendRequestsBtn = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['friend-requests'],
    queryFn: () => fetcher(`/api/users/${userId}/follow_requests`),
  });

  const acceptMutation = useMutation({
    mutationKey: ['friend-request'],
    mutationFn: (id: string) =>
      fetcherWithOptions({
        url: `/api/users/${id}/follow_requests`,
        method: 'POST',
        body: {},
      }),
    
    onSuccess: () => {},
    onError: () => {},
  });

  const handleAccept = (id: string) => {
    acceptMutation.mutate(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
          {data?.requests.length > 0 && (
            <div className='absolute right-0 top-0 h-[20px] w-[20px] rounded-full bg-red-600'>{data.requests.length}</div>
          )}
          <Users2 size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[350px]'>
        <DropdownMenuLabel>Friend requests</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading || isError ? (
          <>Loading...</>
        ) : data.requests.length === 0 ? (
          <div className='p-4'>
            No friend requests
          </div>
        ) : (
          data.requests.map((request: any) => <FriendRequestItem handleAccept={handleAccept} request={request} />)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FriendRequestItem = ({ request, handleAccept }: any) => {
  return (
    <div className='flex h-[50px] items-center p-4'>
      <p>{request.user.nickname}</p>
      <div className='ml-auto flex space-x-2'>
        <Button size='icon' variant='ghost' onClick={() => handleAccept(request.follower_id)}>
          <Check />
        </Button>
        <Button size='icon' variant='ghost'>
          <X />
        </Button>
      </div>
    </div>
  );
};
