import { GroupType } from '@/services/backend/types';
import { Group } from './group';

export const Groups = ({ groups }: { groups: GroupType[] }) => {
  return (
    <div className='flex flex-col space-y-5'>
      {groups.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </div>
  );
};
