import { GroupType } from '@/app/(authenticated)/groups/page';
import { UserType } from '@/providers/user-provider';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
export interface InvitationType {
  group_id: string;
  invited_by: string;
  user_id: string;
  created_at: string;
  user: UserType;
  group: GroupType;
}

export const GroupInvitation = ({ invitation }: { invitation: InvitationType }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (accept: boolean) => {
      fetcherWithOptions({
        url: `/api/groups/${invitation.group_id}/group_invitations`,
        method: accept ? 'POST' : 'DELETE',
        body: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incoming-requests'] });
    },
  });

  return (
    <div className='flex items-center space-x-4 text-sm'>
      <p>
        {invitation.user.first_name} {invitation.user.last_name} invited you to {invitation.group.title}
      </p>
      <div className='space-x-2'>
        <Button onClick={() => mutation.mutate(true)} size='icon' variant='outline' className='rounded-full'>
          <Check size={20} />
        </Button>
        <Button onClick={() => mutation.mutate(false)} size='icon' variant='outline' className='rounded-full'>
          <X size={20} />
        </Button>
      </div>
    </div>
  );
};
