import { Button } from '@/components/ui/button';
import type { JoinRequestType } from './group-join-requests';
import { toast } from '@/components/ui/use-toast';
import { capitalize } from '@/lib/utils';
import { useAcceptGroupJoinRequestMutation, useDeleteGroupJoinRequestMutation } from '@/services/backend/backendApi';
export const GroupJoinRequestsUser = ({ request }: { request: JoinRequestType }) => {
  const [acceptGroupJoinRequest] = useAcceptGroupJoinRequestMutation();
  const [deleteGroupJoinRequest] = useDeleteGroupJoinRequestMutation();

  const acceptJoinRequest = async () => {
    try {
      await acceptGroupJoinRequest({ groupId: request.group_id, userId: request.user_id }).unwrap();
    } catch (error) {
      toast({
        title: 'Error has occured!',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const declineJoinRequest = async () => {
    try {
      await deleteGroupJoinRequest({ groupId: request.group_id, userId: request.user_id }).unwrap();
    } catch (error) {
      toast({
        title: 'Error has occured!',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex h-[75px] items-center rounded-lg border border-border p-4'>
      <h1>
        {capitalize(request.user.first_name)} {capitalize(request.user.last_name)}
      </h1>
      <div className='ml-auto flex space-x-1'>
        <Button onClick={acceptJoinRequest}>Accept</Button>
        <Button onClick={declineJoinRequest} variant='outline' className='hover:bg-destructive hover:text-destructive-foreground'>
          Decline
        </Button>
      </div>
    </div>
  );
};
