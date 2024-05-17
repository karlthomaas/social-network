'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetcher } from '@/lib/fetchers';
import { useSession } from '@/providers/user-provider';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GroupInvitation, InvitationType } from '../notifications/group_invitaion';
import clsx from 'clsx';

interface InvitationsQueryResponse {
  invitations: InvitationType[];
}

export const NotificationBtn = () => {
  const [invitations, setInvitations] = useState<InvitationType[]>([]);
  const { user } = useSession();
  const invitationsQuery = useQuery<InvitationsQueryResponse>({
    queryKey: ['incoming-requests'],
    queryFn: async () => fetcher(`/api/users/${user?.id}/group_invitations`),
    enabled: !!user,
  });

  useEffect(() => {
    if (invitationsQuery.data) {
      setInvitations(invitationsQuery.data.invitations);
    }
  }, [invitationsQuery.data]);

  const removeInvitation = (invitation: InvitationType) => {
    if (!invitations) return;

    setInvitations(invitations.filter((inv) => inv !== invitation));
  };

  return (
    <DropdownMenu>
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
        {invitations.map((invitation: InvitationType, index) => (
          <GroupInvitation removeInvitation={removeInvitation} key={index} invitation={invitation} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
