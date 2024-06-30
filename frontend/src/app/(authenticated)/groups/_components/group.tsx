import { Button } from '@/components/ui/button';
import { GroupType } from '@/services/backend/types';
import Link from 'next/link';

export const Group = ({ group }: { group: GroupType }) => {
  return (
    <div className='flex h-max min-h-[100px] w-full items-center rounded-lg border bg-card p-4 drop-shadow-sm'>
      <div className='flex flex-col space-y-1'>
        <h1 className='text-xl font-semibold'>{group.title}</h1>
        <div className='text-sm text-card-foreground'>{group.description}</div>
      </div>
      <Link className='ml-auto' href={`/groups/${group.id}`}>
        <Button className='bg-primary/10' variant='outline'>
          View
        </Button>
      </Link>
    </div>
  );
};
