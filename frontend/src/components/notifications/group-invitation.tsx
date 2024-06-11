import type { GroupType, NotificationType } from '@/services/backend/types';
import { useAcceptGroupInvitationMutation, useDeclineGroupUserInvitationMutation } from '@/services/backend/actions/groups';
import { toast } from '../ui/use-toast';
import { NotificationLayout } from './notification-layout';
import { useDeleteNotificationMutation } from '@/services/backend/actions/user';

export const GroupInvitation = ({
  notification,
  group,
  removeInvitation,
}: {
  notification: NotificationType;
  group: GroupType;
  removeInvitation: (invitation: string) => void;
}) => {
  const { id, user, receiver } = notification;
  const [deleteNotification] = useDeleteNotificationMutation();
  const [declineRequest] = useDeclineGroupUserInvitationMutation();
  const [acceptRequest] = useAcceptGroupInvitationMutation();

  const handleMutate = async (accept: boolean) => {
    try {
      if (accept) {
        await acceptRequest({ groupId: group.id }).unwrap();
        await deleteNotification(id);
      } else {
        await declineRequest({ groupId: group.id, userId: receiver }).unwrap();
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
