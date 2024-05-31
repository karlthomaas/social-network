import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/spinners';
import { GroupJoinRequestsUser } from './group-join-requests-user';
import { UserType } from '@/providers/user-provider';
import { useGroupJoinRequestsQuery } from '@/services/backend/backendApi';

export interface JoinRequestType {
  group_id: string;
  invited_by: string;
  user_id: string;
  created_at: string;
  user: UserType;
  group: GroupType;
}

export const GroupJoinRequests = ({ id }: { id: string }) => {
  const { data, isLoading, isError, refetch } = useGroupJoinRequestsQuery(id);

  let content;

  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (isError) {
    content = 'Error has occured, try again later!';
  } else {
    content =
      data.requests.length > 0
        ? data.requests.map((request: JoinRequestType, index: number) => <GroupJoinRequestsUser key={index} request={request} />)
        : 'No requests found';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-[250px]' onClick={() => refetch()}>
          View join requests
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Group join requests</DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
