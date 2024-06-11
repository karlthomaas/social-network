import { NotificationLayout } from '@/components/notifications/notification-layout';
import { toast } from '@/components/ui/use-toast';
import { useAcceptGroupJoinRequestMutation, useDeleteGroupJoinRequestMutation } from '@/services/backend/actions/groups';
import { useDeleteNotificationMutation } from '@/services/backend/actions/user';

import type { GroupType, NotificationType } from '@/services/backend/types';

export const GroupRequest = ({
  notification: { sender, id, user},
  group,
  removeInvitation,
}: {
  notification: NotificationType;
  group: GroupType;
  removeInvitation: (id: string) => void;
}) => {
  const [deleteNotification] = useDeleteNotificationMutation();
  const [acceptRequest] = useAcceptGroupJoinRequestMutation();
  const [declineRequest] = useDeleteGroupJoinRequestMutation();

  const handleMutate = async (accept: boolean) => {
    try {
      if (accept) {
        await acceptRequest({ groupId: group.id, userId: sender }).unwrap();
        await deleteNotification(id);
      } else {
        await declineRequest({ groupId: group.id, userId: sender }).unwrap();
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
