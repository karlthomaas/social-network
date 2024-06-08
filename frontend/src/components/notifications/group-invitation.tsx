import type { GroupInvitationType, GroupType } from '@/services/backend/types';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useAcceptGroupInvitationMutation, useDeclineGroupUserInvitationMutation } from '@/services/backend/actions/groups';
import { toast } from '../ui/use-toast';
import { StringDecoder } from 'string_decoder';
import { NotificationLayout } from './notification-layout';
import { UserType } from '@/features/auth/types';

export const GroupInvitation = ({
  id,
  group,
  senderId,
  user,
  removeInvitation,
}: {
  id: string;
  group: GroupType;
  senderId: string;
  user: UserType;
  removeInvitation: (invitation: string) => void;
}) => {
  const [declineRequest] = useDeclineGroupUserInvitationMutation();
  const [acceptRequest] = useAcceptGroupInvitationMutation();

  const handleMutate = async (accept: boolean) => {
    try {
      if (accept) {
        await acceptRequest({ groupId: group.id }).unwrap();
      } else {
        await declineRequest({ groupId: group.id, userId: senderId }).unwrap();
      }
      removeInvitation(id);
    } catch (error) {
      toast({
        title: 'Failed to process request',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <NotificationLayout text={`${user.first_name} ${user.last_name} invited you to ${group.title}`} showActions callback={handleMutate} />
  );
};
