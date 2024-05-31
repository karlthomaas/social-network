import { capitalize } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { FollowerType } from './group-invite-content';
import { useState } from 'react';
import { useCreateGroupInvitationMutation, useDeleteGroupInvitationMutation } from '@/services/backend/backendApi';

export const GroupInviteUser = ({
  isInvited: inviteStatus,
  groupId,
  follower,
}: {
  isInvited: boolean;
  groupId: string;
  follower: FollowerType;
}) => {
  const [createGroupInvitation, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateGroupInvitationMutation();
  const [deleteGroupInvitation, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteGroupInvitationMutation();

  const [isInvited, setIsInvited] = useState(inviteStatus);
  const [buttonText, setButtonText] = useState(isInvited ? 'Invited' : 'Invite');

  const handleInvitationToggle = async () => {
    try {
      if (isInvited) {
        await deleteGroupInvitation({ groupId, userId: follower.follower_id }).unwrap();
        setIsInvited(false);
      } else {
        await createGroupInvitation({ groupId, userId: follower.follower_id }).unwrap();
        setIsInvited(true);
      }
      setButtonText(isInvited ? 'Cancelled' : 'Invited');
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex h-[75px] items-center rounded-lg border border-border p-4'>
      <h1>
        {capitalize(follower.user.first_name)} {capitalize(follower.user.last_name)}
      </h1>
      <Button
        disabled={isLoadingCreate || isLoadingDelete || isSuccessCreate || isSuccessDelete}
        onClick={handleInvitationToggle}
        className='ml-auto'
      >
        {buttonText}
      </Button>
    </div>
  );
};
