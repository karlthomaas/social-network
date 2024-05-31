import { useAppSelector } from '@/lib/hooks';
import { RequestButton } from './buttons';

export const GroupNotMemberView = ({ id }: { id: string }) => {
  const { group } = useAppSelector((state) => state.groups.groups[id])
  return <RequestButton className='max-w-sm' groupId={group.id} />;
};
