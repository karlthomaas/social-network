import React from 'react';
import { useAppSelector } from '@/lib/hooks';

export const GroupDetails = ({ id }: { id: string }) => {
  const { group } = useAppSelector((state) => state.groups.groups[id]);
  return (
    <div className='flex h-max min-h-[150px] w-full flex-col justify-center rounded-lg bg-card p-4'>
      <h1 className='text-4xl font-semibold'>{group.title}</h1>
      <p className='mt-2 text-lg'>{group.description}</p>
    </div>
  );
};
