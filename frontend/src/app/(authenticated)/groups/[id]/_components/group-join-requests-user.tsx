import { Button } from '@/components/ui/button';
import type { JoinRequestType } from './group-join-requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { toast } from '@/components/ui/use-toast';
import { capitalize } from '@/lib/utils';

export const GroupJoinRequestsUser = ({ request }: { request: JoinRequestType }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['group-join-requests'],
    mutationFn: (action: boolean) =>
      fetcherWithOptions({
        url: `/api/groups/${request.group_id}/requests/users/${request.user_id}`,
        method: action ? 'POST' : 'DELETE',
        body: {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-join-requests'] });
    },
    onError: () => {
      toast({
        title: 'Error has occured!',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });
  return (
    <div className='flex h-[75px] items-center rounded-lg border border-border p-4'>
      <h1>{capitalize(request.user.first_name)} {capitalize(request.user.last_name)}</h1>
      <div className='flex space-x-1 ml-auto'>
        <Button onClick={() => mutation.mutate(true)}>Accept</Button>
        <Button onClick={() => mutation.mutate(false)} variant='outline' className='hover:bg-destructive hover:text-destructive-foreground'>
          Decline
        </Button>
      </div>
    </div>
  );
};
