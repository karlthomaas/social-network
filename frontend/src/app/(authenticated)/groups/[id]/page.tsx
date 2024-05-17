'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/providers/user-provider';
import { useEffect, useState } from 'react';

import { GroupType } from '../page';
import { fetcher } from '@/lib/fetchers';
import { GroupDetails } from './_components/group-details';
import { GroupMemberView } from './_components/group-member-view';
import { GroupNotMemberView } from './_components/group-not-member-view';

interface GroupQueryResponse {
  group: GroupType;
}

export default function GroupPage({ params }: { params: { id: string } }) {
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const { user } = useSession();
  // Fetches the group details
  const groupQuery = useQuery<GroupQueryResponse>({
    queryKey: ['group', params.id],
    queryFn: () => fetcher(`/api/groups/${params.id}`),
  });

  // Returns error if user is not a member of the group
  const isMemberQuery = useQuery({
    queryKey: ['isMember', params.id],
    queryFn: () => fetcher(`/api/groups/${params.id}/members`),
    enabled: !!groupQuery.data, // only request if group is found
    retry: 1,
  });

  useEffect(() => {
    if (isMemberQuery.data) {
      setIsMember(true);
    } else {
      setIsMember(false);
    }
  }, [isMemberQuery.data]);

  useEffect(() => {
    if (groupQuery.data && user?.id === groupQuery.data.group.user_id) {
      setIsOwner(true);
    }
  }, [groupQuery.data, user?.id]);

  if (groupQuery.isLoading || isMemberQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!groupQuery.data) {
    return <div>Group not found</div>;
  }

  return (
    <div className='flex flex-col space-y-5'>
      <GroupDetails title={groupQuery.data.group.title} description={groupQuery.data.group.description} />
      {isMember ? (
        <GroupMemberView user={user} group={groupQuery.data.group} isOwner={isOwner} />
      ) : (
        <GroupNotMemberView group={groupQuery.data.group} />
      )}
    </div>
  );
}
