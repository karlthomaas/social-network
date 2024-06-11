import { NotificationLayout } from '@/components/notifications/notification-layout';
import { toast } from '@/components/ui/use-toast';
import { useAcceptFollowRequestMutation, useDeleteFollowRequestMutation } from '@/services/backend/actions/followers';
import { useDeleteNotificationMutation } from '@/services/backend/actions/user';
import { NotificationType } from '@/services/backend/types';

export const FollowRequest = ({
  notification: { id, follow_request_id, user, sender },
  removeInvitation
}: {
  notification: NotificationType;
  removeInvitation: (id: string) => void;
}) => {
  const [deleteNotification] = useDeleteNotificationMutation();
  const [declineRequest] = useDeleteFollowRequestMutation();
  const [acceptRequest] = useAcceptFollowRequestMutation();

  const handleCallback = async (action: boolean) => {
    if (!follow_request_id && sender) return;

    try {
      if (action) {
        await acceptRequest(sender).unwrap();
      } else {
        await declineRequest(sender).unwrap();
      }
      await deleteNotification(id);
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
    <NotificationLayout text={`${user.first_name} ${user.last_name} has requested to follow you!`} showActions callback={handleCallback} />
  );
};
