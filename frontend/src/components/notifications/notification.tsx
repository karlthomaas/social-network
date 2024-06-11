import { GroupInvitation } from "./group-invitation";
import { memo } from "react";

import type { NotificationType } from "@/services/backend/types";
import { GroupRequest } from "@/components/notifications/group-request";
import { GroupEvent } from "@/components/notifications/group-event";
import { FollowRequest } from "@/components/notifications/follow-request";

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
        return <FollowRequest notification={notification} removeInvitation={removeInvitation} />;
      } else if (notification.group_invitation_id) {
        return <GroupInvitation notification={notification} group={notification.group} removeInvitation={removeInvitation}/>;
      } else if (notification.group_request_id) {
        return <GroupRequest notification={notification} group={notification.group} removeInvitation={removeInvitation}/>;
      } else if (notification.group_event_id) {
        return <GroupEvent notification={notification} group={notification.group} removeInvitation={removeInvitation}/>;
      } else {
        return <div>error</div>;
      } 
    }
  );
  
  Notification.displayName = 'Notification';
  