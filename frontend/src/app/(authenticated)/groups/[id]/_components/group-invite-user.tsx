import { capitalize } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { FollowerType } from './group-invite';

export const GroupInviteUser = ({ group_id, follower }: { group_id: string; follower: FollowerType }) => {
  const mutation = useMutation({
    mutationKey: ['group-invite'],
    mutationFn: async () => {
      return fetcherWithOptions({ url: `/api/groups/${group_id}/users/${follower.follower_id}`, method: 'POST', body: {} });
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
        {mutation.isPending ? <LoadingSpinner /> : mutation.isSuccess ? 'Invited' : 'Invite'}
      </Button>
    </div>
  );
};
