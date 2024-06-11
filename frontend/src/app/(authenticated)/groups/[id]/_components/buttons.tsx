import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import { useGetGroupRequestStatusQuery } from '@/services/backend/actions/groups';
import { useCreateGroupRequestMutation, useDeleteGroupRequestMutation } from '@/services/backend/actions/groups';
import { useEffect, useState } from 'react';

import type { UserType } from '@/features/auth/types';
import type { GroupType } from '@/services/backend/types';

interface JoinRequestStatus {
  group_id: string;
  user_id: string;
  created_at: string;
  user: UserType;
}

interface RequestButtonProps {
  group: GroupType;
  className?: string;
}

export const RequestButton = ({ group, className }: RequestButtonProps) => {
  const dispatch = useAppDispatch();
  const [requestStatus, setRequestStatus] = useState<JoinRequestStatus | null>(null);
  const [createRequest, { isLoading: isLoadingCreate }] = useCreateGroupRequestMutation();
  const [deleteRequest, { isLoading: isLoadingDelete }] = useDeleteGroupRequestMutation();
  const joinRequestStatus = useGetGroupRequestStatusQuery(group.id);

  const handleRequest = async () => {
    try {
      if (requestStatus) {
        await deleteRequest({ groupId: group.id, userId: requestStatus.user_id }).unwrap();
        setRequestStatus(null);
      } else {
        const response = await createRequest(group.id).unwrap();
        setRequestStatus({ ...response.request });
      }

      dispatch({
        type: 'socket/send_message',
        payload: {
          type: 'notification',
          receiver: group.user_id,
          event_type: 'group_request',
        },
      });
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
