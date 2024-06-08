import { NotificationLayout } from '@/components/notifications/notification-layout';
import { toast } from '@/components/ui/use-toast';
import type { UserType } from '@/features/auth/types';
import { useAcceptGroupJoinRequestMutation, useDeleteGroupJoinRequestMutation } from '@/services/backend/actions/groups';
import type { GroupType } from '@/services/backend/types';

export const GroupRequest = ({
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
  removeInvitation: (id: string) => void;
}) => {
  const [acceptRequest] = useAcceptGroupJoinRequestMutation();
  const [declineRequest] = useDeleteGroupJoinRequestMutation();

  const handleMutate = async (accept: boolean) => {
    try {
      if (accept) {
        await acceptRequest({ groupId: group.id, userId: senderId }).unwrap();
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
    <NotificationLayout
      text={`${user.first_name} ${user.last_name} requested to join ${group.title}`}
      showActions
      callback={handleMutate}
    />
  );
};
