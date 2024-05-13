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
import { LoadingSpinner } from '../ui/spinners';
import { GroupInvitation, InvitationType } from '../notifications/group_invitaion';

interface InvitationsQueryResponse {
  invitations: InvitationType[];
}

export const NotificationBtn = () => {
  const { user } = useSession();
  const invitationsQuery = useQuery<InvitationsQueryResponse>({
    queryKey: ['incoming-requests'],
    queryFn: async () => fetcher(`/api/users/${user?.id}/group_invitations`),
    enabled: !!user,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Bell size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitationsQuery.data?.invitations.map((invitation: InvitationType, index) => (
            <GroupInvitation key={index} invitation={invitation} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
