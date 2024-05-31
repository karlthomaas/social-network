import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { fetcherWithOptions, fetcher } from '@/lib/fetchers';
import { UserType } from '@/providers/user-provider';
import { useCreateGroupRequestMutation, useDeleteGroupRequestMutation, useGroupRequestStatusQuery } from '@/services/backend/backendApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [createRequest, { isLoading: isLoadingCreate }] = useCreateGroupRequestMutation();
  const [deleteRequest, { isLoading: isLoadingDelete }] = useDeleteGroupRequestMutation();
  const joinRequestStatus = useGroupRequestStatusQuery(groupId);

  const [requestStatus, setRequestStatus] = useState<JoinRequestStatus | null>(null);
  const requestObject = useRef<JoinRequestStatus | null>();

  const handleRequest = async () => {
    try {
      if (requestStatus) {
        await deleteRequest({ groupId, userId: requestStatus.user_id }).unwrap();
        setRequestStatus(null);
      } else {
        const response = await createRequest(groupId).unwrap();
        setRequestStatus({...response.request});
      }
    } catch (err) {
      toast({
        title: 'Error has occured',
        description: 'Try again later',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (joinRequestStatus.data) {
      setRequestStatus({...joinRequestStatus.data.request});
    }
  }, [joinRequestStatus.data]);

  return (
    <Button className={className} onClick={handleRequest} disabled={isLoadingCreate || isLoadingDelete}>
      {isLoadingCreate || isLoadingDelete ? <LoadingSpinner /> : requestStatus ? 'Cancel request' : 'Request to join'}
    </Button>
  );
};
