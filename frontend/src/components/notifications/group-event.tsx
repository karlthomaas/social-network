import { NotificationLayout } from '@/components/notifications/notification-layout';
import { useDeleteNotificationMutation } from '@/services/backend/actions/user';

import type { GroupType, NotificationType } from '@/services/backend/types';
import { useRouter } from 'next/navigation';

export const GroupEvent = ({
  notification: { id, group_event_id },
  group,
  removeInvitation,
}: {
  notification: NotificationType;
  group: GroupType;
  removeInvitation: (id: string) => void;
}) => {
  const router = useRouter();
  const [deleteNotification] = useDeleteNotificationMutation();

  const onCallback = () => {
    if (group_event_id) {
      router.push(`/groups/${group.id}?open=events&event=${group_event_id}`);
    }

    deleteNotification(id);
    removeInvitation(id);
  };

  return <NotificationLayout text={`New event in ${group.title}!`} showActions={false} showRedirect callback={onCallback} />;
};
