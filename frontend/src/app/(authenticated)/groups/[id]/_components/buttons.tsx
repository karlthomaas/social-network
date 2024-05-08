import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { fetcherWithOptions } from '@/lib/fetchers';
import { useMutation } from '@tanstack/react-query';

export const RequestButton = ({ group_id }: { group_id: string }) => {
  const mutation = useMutation({
    mutationFn: async () =>
      fetcherWithOptions({
        url: `/api/groups/${group_id}/requests`,
        method: 'POST',
        body: {}
      }),
    onError: () => {
      toast({
        title: 'Error has occured',
        description: 'Try again later',
        variant: 'destructive',
      });
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || mutation.isSuccess}>
      {mutation.isPending ? <LoadingSpinner /> : mutation.isSuccess ? 'Requested' : 'Request to join'}
    </Button>
  );
};

export const InviteButton = () => {
  return <Button asChild>Invite</Button>;
};
