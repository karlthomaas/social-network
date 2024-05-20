import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { fetcherWithOptions, fetcher } from '@/lib/fetchers';
import { UserType } from '@/providers/user-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState, useRef } from 'react';

interface JoinRequestStatusQuery {
  request: JoinRequestStatus;
}

interface JoinRequestStatus {
  group_id: string;
  user_id: string;
  created_at: string;
  user: UserType;
}

interface RequestButtonProps {
  groupId: string;
  className?: string;
}

export const RequestButton = ({ groupId, className }: RequestButtonProps) => {
  const [btnText, setBtnText] = useState('');
  const queryClient = useQueryClient();
  const requestObject = useRef<JoinRequestStatus | null>();

  const mutation = useMutation({
    mutationFn: async () => {
      const method = requestObject.current ? 'DELETE' : 'POST';
      const url = requestObject.current
        ? `/api/groups/${groupId}/requests/users/${requestObject.current.user_id}`
        : `/api/groups/${groupId}/requests`;

      return fetcherWithOptions({
        url,
        method,
        body: {},
      });
    },
    onSuccess: (response: any) => {
      requestObject.current = requestObject.current ? null : response.request;
      // reset query so the joinRequestStatus will update the button in useEffect with new data.
      queryClient.resetQueries({ queryKey: ['joinRequestStatus'] });
    },
    onError: () => {
      toast({
        title: 'Error has occured',
        description: 'Try again later',
        variant: 'destructive',
      });
    },
  });

  const joinRequestStatus = useQuery<JoinRequestStatusQuery>({
    queryKey: ['joinRequestStatus', groupId],
    queryFn: () => fetcher(`/api/groups/${groupId}/join-request-status`),
    retry: 1,
  });

  useEffect(() => {
    if (joinRequestStatus.data) {
      setBtnText('Cancel request');
      requestObject.current = joinRequestStatus.data.request;
    } else {
      setBtnText('Request to join');
      requestObject.current = null;
    }
  }, [joinRequestStatus.data]);

  return (
    <Button className={className} onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? <LoadingSpinner /> : btnText}
    </Button>
  );
};