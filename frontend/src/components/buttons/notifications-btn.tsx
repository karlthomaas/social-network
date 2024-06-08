'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import {useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useGetUserNotificationsQuery } from '@/services/backend/actions/user';
import { Notification } from '@/components/notifications/notification';
import type { NotificationType } from '@/services/backend/types';

export const NotificationBtn = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { data, isLoading, refetch } = useGetUserNotificationsQuery();

  useEffect(() => {
    if (data?.notifications) {
      console.log(data.notifications);
      setNotifications(data.notifications);
    }
  }, [data]);

  const removeInvitation = useCallback(
    (id: string) => {
      setNotifications(notifications.filter((inv) => inv.id !== id));
    },
    [notifications]
  );

  return (
    <DropdownMenu onOpenChange={() => refetch()}>
      <DropdownMenuTrigger>
        <div className='relative'>
          <Bell size={24} />
          <div
            className={clsx('absolute -right-2 -top-2 h-[20px] w-[20px] rounded-full bg-red-600', {
              block: notifications.length !== 0,
              hidden: notifications.length === 0,
            })}
          >
            {notifications.length}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[350px]'>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <>Loading...</>
        ) : notifications.length === 0 ? (
          <div className='p-4'>No notifications</div>
        ) : (
          notifications.map((notification, index) => (
            <Notification key={index} notification={notification} removeInvitation={removeInvitation} />
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};