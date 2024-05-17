import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroupInviteContent } from './group-invite-content';

export const GroupInvite = ({ groupId }: { groupId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite followers</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Invite friends to Group</DialogHeader>
        <GroupInviteContent groupId={groupId} />
      </DialogContent>
    </Dialog>
  );
};
