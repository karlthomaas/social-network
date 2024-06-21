'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useGetUserNotificationsQuery } from '@/services/backend/actions/user';
import { Notification } from '@/components/notifications/notification';
import type { NotificationType } from '@/services/backend/types';
import { clsx } from 'clsx';

export const NotificationBtn = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { data, isLoading, refetch } = useGetUserNotificationsQuery();

  useEffect(() => {
    if (data?.notifications) {
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
      <DropdownMenuTrigger className='relative'>
        <>
          <Button variant='ghost' size='icon'>
            <Bell size={24} />
          </Button>
          <div
            className={clsx('absolute -right-2 -top-2 h-[20px] w-[20px] rounded-full bg-red-600', {
              block: notifications.length !== 0,
              hidden: notifications.length === 0,
            })}
          >
            {notifications.length}
          </div>
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[400px]'>
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
