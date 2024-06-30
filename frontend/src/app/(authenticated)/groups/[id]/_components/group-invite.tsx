import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroupInviteContent } from './group-invite-content';
import { useAppDispatch } from '@/lib/hooks';
import { backendApi } from '@/services/backend/backendApi';

export const GroupInvite = ({ groupId }: { groupId: string }) => {
  const dispatch = useAppDispatch();

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      dispatch(backendApi.util.invalidateTags(['GroupInvitations']));
    }
  };
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Invite followers</Button>
      </DialogTrigger>
      <DialogContent className='bg-card'>
        <DialogHeader>Invite friends to Group</DialogHeader>
        <GroupInviteContent groupId={groupId} />
      </DialogContent>
    </Dialog>
  );
};
