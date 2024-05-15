import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { fetcherWithOptions } from '@/lib/fetchers';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const GroupLeaveButton = ({ groupId, userId }: { groupId: string; userId: string | undefined }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await fetcherWithOptions({
        url: `/api/groups/${groupId}/members/users/${userId}`,
        body: {},
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['isMember']});
      toast({
        title: 'Success',
        description: 'You have left the group',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to leave group',
        variant: 'destructive',
      });
    },
  });
  return (
    <Button disabled={!userId} onClick={() => mutation.mutate()} className='w-max'>
      Leave group
    </Button>
  );
};
