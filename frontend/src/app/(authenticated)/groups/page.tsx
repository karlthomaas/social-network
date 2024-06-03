'use client';

import { Input } from '@/components/ui/input';
import { CreateGroupBtn } from './_components/group-create-btn';
import { ChangeEvent, useEffect, useState } from 'react';
import { Groups } from './_components/groups';
import { GroupType } from '@/services/backend/types';
import { useGetGroupsQuery } from '@/services/backend/actions/groups';

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const { data } = useGetGroupsQuery();

  useEffect(() => {
    if (data?.groups) {
      setGroups(data.groups);
    }
  }, [data]);

  const handleGroupSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (!data) return;

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
