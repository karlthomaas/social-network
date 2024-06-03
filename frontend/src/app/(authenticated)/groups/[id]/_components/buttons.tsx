import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import type { UserType } from '@/features/auth/types';

import { useGetGroupRequestStatusQuery } from '@/services/backend/actions/groups';
import { useCreateGroupRequestMutation, useDeleteGroupRequestMutation } from '@/services/backend/actions/groups';
import { useEffect, useState } from 'react';

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
  const [requestStatus, setRequestStatus] = useState<JoinRequestStatus | null>(null);
  const [createRequest, { isLoading: isLoadingCreate }] = useCreateGroupRequestMutation();
  const [deleteRequest, { isLoading: isLoadingDelete }] = useDeleteGroupRequestMutation();
  const joinRequestStatus = useGetGroupRequestStatusQuery(groupId);

  const handleRequest = async () => {
    try {
      if (requestStatus) {
        await deleteRequest({ groupId, userId: requestStatus.user_id }).unwrap();
        setRequestStatus(null);
      } else {
        const response = await createRequest(groupId).unwrap();
        setRequestStatus({ ...response.request });
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
      setRequestStatus({ ...joinRequestStatus.data.request });
    }
  }, [joinRequestStatus.data]);

  return (
    <Button className={className} onClick={handleRequest} disabled={isLoadingCreate || isLoadingDelete}>
      {isLoadingCreate || isLoadingDelete ? <LoadingSpinner /> : requestStatus ? 'Cancel request' : 'Request to join'}
    </Button>
  );
};
