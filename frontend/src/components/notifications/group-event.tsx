import { NotificationLayout } from "@/components/notifications/notification-layout";

import type { GroupType } from "@/services/backend/types";

export const GroupEvent = ({ id, group }: { id: string, group: GroupType }) => {
    return (
        <NotificationLayout text={`New event in ${group.title}!`} showActions={false} callback={() => {}} />
    )
};