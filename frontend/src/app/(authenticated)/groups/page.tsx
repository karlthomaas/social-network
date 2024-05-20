'use client';

import { Input } from '@/components/ui/input';
import { CreateGroupBtn } from './_components/group-create-btn';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { ChangeEvent, useEffect, useState } from 'react';
import { Groups } from './_components/groups';

export interface GroupType {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupType[]>([]);

  const { data } = useQuery({
    queryKey: ['groups'],
    queryFn: () => fetcher('/api/groups'),
  });


  useEffect(() => {
    if (data) {
      setGroups(data.groups);
    }
  }, [data]);

  const handleGroupSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    const filteredGroups = data.groups.filter((group: GroupType) => group.title.toLowerCase().includes(search.toLocaleLowerCase()));
    setGroups(filteredGroups);
  };
  return (
    <div className='flex flex-col '>
      <div className='flex space-x-2'>
        <Input onChange={handleGroupSearch} placeholder='Search for groups' />
        <CreateGroupBtn />
      </div>
      <div>
        <Groups groups={groups} />
      </div>
    </div>
  );
}
