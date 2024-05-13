import { capitalize } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { FollowerType } from './group-invite-content';
import { useEffect, useRef, useState } from 'react';

export const GroupInviteUser = ({ isInvited, groupId, follower }: { isInvited: boolean; groupId: string; follower: FollowerType }) => {
  const [buttonText, setButtonText] = useState('');
  const isInvitedRef = useRef(isInvited);

  useEffect(() => {
    setButtonText(isInvited ? 'Cancel' : 'Invite')
  }, []);

  const mutation = useMutation({
    mutationKey: ['group-invite'],
    mutationFn: async () => {
      const url = isInvitedRef.current
        ? `/api/groups/${groupId}/group_invitations/users/${follower.follower_id}`
        : `/api/groups/${groupId}/users/${follower.follower_id}`;

      const method = isInvitedRef.current ? 'DELETE' : 'POST';
      return fetcherWithOptions({ url, method, body: {} });
    },
    onSuccess: () => {
      isInvitedRef.current = !isInvitedRef.current;
      setButtonText(isInvitedRef.current ? 'Invited' : 'Cancelled');
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'Try again later...',
        variant: 'destructive',
      });
    },
  });


  return (
    <div className='flex h-[75px] items-center rounded-lg border border-border p-4'>
      <h1>
        {capitalize(follower.user.first_name)} {capitalize(follower.user.last_name)}
      </h1>
      <Button disabled={mutation.isSuccess || mutation.isPending} onClick={() => mutation.mutate()} className='ml-auto'>
        {buttonText}
      </Button>
    </div>
  );
};
