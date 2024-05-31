'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GroupInvitation } from '../notifications/group_invitation';
import clsx from 'clsx';
import type { GroupInvitationType } from '@/services/backend/types';
import { useGetUserGroupInvitationsQuery } from '@/services/backend/backendApi';
import { useAppSelector } from '@/lib/hooks';
import { skipToken } from '@reduxjs/toolkit/query';

export const NotificationBtn = () => {
  const [invitations, setInvitations] = useState<GroupInvitationType[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const invitationsQuery = useGetUserGroupInvitationsQuery(user?.id ?? skipToken, { skip: !user?.id });
  console.log("🚀 ~ NotificationBtn ~ invitationsQuery:", invitationsQuery)

  useEffect(() => {
    if (invitationsQuery.data) {
      setInvitations(invitationsQuery.data.invitations);
    }
  }, [invitationsQuery.data]);

  const removeInvitation = (invitation: GroupInvitationType) => {
    if (!invitations) return;

    setInvitations(invitations.filter((inv) => inv !== invitation));
  };

  return (
    <DropdownMenu onOpenChange={() => invitationsQuery.refetch()}>
      <DropdownMenuTrigger>
        <div className='relative'>
          <Bell size={24} />
          <div
            className={clsx('absolute -right-2 -top-2 hidden size-4 rounded-full bg-red-600 text-[10px]', {
              block: invitations.length !== 0,
            })}
          >
            {invitations.length}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitations.map((invitation: GroupInvitationType, index) => (
          <GroupInvitation removeInvitation={removeInvitation} key={index} invitation={invitation} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
