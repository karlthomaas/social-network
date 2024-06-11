import { capitalize } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { FollowerType } from '@/services/backend/types';
import { useState } from 'react';
import { useCreateGroupUserInvitationMutation, useCancelGroupUserInvitationMutation } from '@/services/backend/actions/groups';
import { useAppDispatch } from '@/lib/hooks';

export const GroupInviteUser = ({
  isInvited: inviteStatus,
  groupId,
  follower,
}: {
  isInvited: boolean;
  groupId: string;
  follower: FollowerType;
}) => {
  const dispatch = useAppDispatch();
  const [createGroupInvitation, { isLoading: isLoadingCreate }] = useCreateGroupUserInvitationMutation();
  const [deleteGroupInvitation, { isLoading: isLoadingDelete }] = useCancelGroupUserInvitationMutation();

  const [isInvited, setIsInvited] = useState(inviteStatus);

  const handleInvitationToggle = async () => {
    try {
      if (isInvited) {
        await deleteGroupInvitation({ groupId, userId: follower.follower_id }).unwrap();
        setIsInvited(false);
      } else {
        await createGroupInvitation({ groupId, userId: follower.follower_id }).unwrap();
        setIsInvited(true);
        dispatch({
          type: 'socket/send_message',
          payload: {
            type: 'notification',
            receiver: follower.follower_id,
            message: `You have been invited to join a group`,
            event_type: 'group_invitation',
          },
        })
      }
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
        disabled={isLoadingCreate || isLoadingDelete}
        onClick={handleInvitationToggle}
        className='ml-auto'
      >
        {isInvited ? 'Cancel' : 'Invite'}
      </Button>
    </div>
  );
};
