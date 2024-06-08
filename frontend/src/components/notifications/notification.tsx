import { GroupInvitation } from "./group-invitation";
import { memo } from "react";

import type { NotificationType } from "@/services/backend/types";
import { GroupRequest } from "@/components/notifications/group-request";
import { GroupEvent } from "@/components/notifications/group-event";

export const Notification = memo(
    ({ notification, removeInvitation }: { notification: NotificationType; removeInvitation: (id: string) => void }) => {
      /*
    There are  4 types of notifications:
    - follow request
    - group invitation
    - group request
    - group event
    */
  
      if (notification.follow_request_id) {
        return <div>Follow request</div>;
      } else if (notification.group_invitation_id) {
        return <GroupInvitation id={notification.id} group={notification.group} senderId={notification.receiver} user={notification.user} removeInvitation={removeInvitation}/>;
      } else if (notification.group_request_id) {
        return <GroupRequest id={notification.id} group={notification.group} senderId={notification.sender} user={notification.user} removeInvitation={removeInvitation}/>;
      } else if (notification.group_event_id) {
        return <GroupEvent id={notification.id} group={notification.group}/>;
      } else {
        return <div>error</div>;
      }
    }
  );
  
  Notification.displayName = 'Notification';
  