import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/spinners';
import { fetcher } from '@/lib/fetchers';
import { useQuery } from '@tanstack/react-query';
import { GroupJoinRequestsUser } from './group-join-requests-user';

export interface JoinRequestType {
  group_id: string;
  invited_by: string;
  user_id: string;
  created_at: string;
}

export const GroupJoinRequests = ({ groupId }: { groupId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['group-join-requests'],
    queryFn: async () => fetcher(`/api/groups/${groupId}/invitations`),
  });

  let content;

  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (isError) {
    content = 'Error has occured, try again later!';
  } else {
    content = data.invitations.map((request: JoinRequestType) => <GroupJoinRequestsUser request={request} />);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-[250px]'>
          View join requests
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Group join requests</DialogHeader>
        { content }
      </DialogContent>
    </Dialog>
  );
};
