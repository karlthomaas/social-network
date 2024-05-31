import type { InvitationType } from '@/services/backend/types';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useAcceptGroupInvitationMutation, useDeleteGroupInvitationMutation } from '@/services/backend/backendApi';
import { toast } from '../ui/use-toast';

export const GroupInvitation = ({ invitation, removeInvitation }: { invitation: InvitationType, removeInvitation: (invitation: InvitationType) => void }) => {
  const [declineRequest] = useDeleteGroupInvitationMutation();
  const [acceptRequest] = useAcceptGroupInvitationMutation();

  const handleMutate = async (accept: boolean) => {
    try {
      if (accept) {
        await acceptRequest({ groupId: invitation.group_id });
      } else {
        await declineRequest({ groupId: invitation.group_id });
      }
      removeInvitation(invitation);
    } catch (error) {
      toast({
        title: 'Failed to process request',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex items-center space-x-4 text-sm'>
      <p>
        {invitation.user.first_name} {invitation.user.last_name} invited you to {invitation.group.title}
      </p>
      <div className='space-x-2'>
        <Button onClick={() => handleMutate(true)} size='icon' variant='outline' className='rounded-full'>
          <Check size={20} />
        </Button>
        <Button onClick={() => handleMutate(false)} size='icon' variant='outline' className='rounded-full'>
          <X size={20} />
        </Button>
      </div>
    </div>
  );
};
