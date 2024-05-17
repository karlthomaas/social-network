import { GroupType } from '../page';
import { Group } from './group';

export const Groups = ({ groups }: { groups: GroupType[] }) => {
  return (
    <div className='flex flex-col space-y-5 mt-10'>
      {groups.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </div>
  );
};
