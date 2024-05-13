import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { fetcherWithOptions, fetcher } from '@/lib/fetchers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface RequestButtonProps {
  groupId: string;
}

export const RequestButton = ({ groupId }: RequestButtonProps) => {
  const [joinRequest, setJoinRequest] = useState<'pending' | 'none' | null>(null);
  const queryClient = useQueryClient();

  const joinRequestStatus = useQuery({
    queryKey: ['joinRequestStatus', groupId],
    queryFn: () => fetcher(`/api/groups/${groupId}/join-request-status`),
    retry: 1,
  });

  const mutation = useMutation({
    // todo create cancel group request mutation
    mutationFn: async () =>
      fetcherWithOptions({
        url: `/api/groups/${groupId}/requests`,
        method: 'POST',
        body: {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joinRequestStatus'] });
    },
    onError: () => {
      toast({
        title: 'Error has occured',
        description: 'Try again later',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (joinRequestStatus.data) {
      setJoinRequest('pending');
    } else if (joinRequestStatus.isError) {
      setJoinRequest('none');
    }
  }, [joinRequestStatus.data]);

  let btnText = '';
  if (joinRequest === 'pending') {
    btnText = 'Cancel request';
  } else if (joinRequest === 'none') {
    btnText = 'Request to join';
  }

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || mutation.isSuccess}>
      {mutation.isPending ? <LoadingSpinner /> : btnText}
    </Button>
  );
};

export const InviteButton = () => {
  return <Button>Invite followers</Button>;
};
