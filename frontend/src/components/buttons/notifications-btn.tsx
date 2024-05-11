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

export interface groupInvitation {
  group_id: string,
  invited_by: string,
  user_id: string,
  created_at: string

}
export const NotificationBtn = () => {
  const { user } = useSession();
  const invitationsQuery = useQuery({
    queryKey: ['incoming-requests'],
    queryFn: async () => fetcher(`/api/users/${user?.id}/group_invitations`),
    enabled: !!user,
  });


  let content;

  if (invitationsQuery.isLoading) {
    content = <LoadingSpinner />
  } else if ( invitationsQuery.isError) {
    content = 'Error has occured, try again later!';
  } else {
    // invitationsQuery.data.
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Bell size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Nothing here...</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
