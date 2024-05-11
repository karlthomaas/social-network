import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroupInviteContent } from './group-invite-content';

export const GroupInvite = ({ group_id }: { group_id: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite followers</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Invite friends to Group</DialogHeader>
        <GroupInviteContent group_id={group_id} />
      </DialogContent>
    </Dialog>
  );
};
