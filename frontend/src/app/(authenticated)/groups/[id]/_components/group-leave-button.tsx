import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinners';
import { toast } from '@/components/ui/use-toast';
import { useLeaveGroupMutation } from '@/services/backend/actions/groups';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setRole } from '@/features/groups/groupsSlice';

export const GroupLeaveButton = ({ id }: { id: string }) => {
  const { group } = useAppSelector((state) => state.groups.groups[id]);
  const { user } = useAppSelector((state) => state.auth);

  const [leaveGroup, { isLoading }] = useLeaveGroupMutation();
  const dispatch = useAppDispatch();

  const handleLeaveGroup = async () => {
    if (!user?.id) return;

    try {
      await leaveGroup({ groupId: group.id, userId: user.id }).unwrap();
      toast({
        title: 'Success',
        description: 'You have left the group',
      });

      dispatch(setRole({ groupId: id, role: null }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to leave group',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button disabled={!user?.id || isLoading} onClick={handleLeaveGroup} className='w-max'>
      {isLoading ? <LoadingSpinner /> : 'Leave group'}
    </Button>
  );
};
