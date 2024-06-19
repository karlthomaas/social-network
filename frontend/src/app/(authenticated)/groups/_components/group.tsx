import { Button } from '@/components/ui/button';
import { GroupType } from '../page';
import Link from 'next/link';

export const Group = ({ group }: { group: GroupType }) => {
  return (
    <div className='flex h-max min-h-[100px] w-full items-center rounded-lg border  p-4'>
      <div className='flex flex-col space-y-1'>
        <h1 className='text-xl font-semibold'>{group.title}</h1>
        <div className='text-sm text-neutral-300'>{group.description}</div>
      </div>
      <Link className='ml-auto' href={`/groups/${group.id}`}>
        <Button className='' variant='outline'>
          View
        </Button>
      </Link>
    </div>
  );
};
