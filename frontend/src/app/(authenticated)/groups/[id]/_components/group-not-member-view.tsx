import { GroupType } from '../../page';
import { RequestButton } from './buttons';

export const GroupNotMemberView = ({ group }: { group: GroupType }) => {
  return <RequestButton className='max-w-sm' groupId={group.id} />;
};
