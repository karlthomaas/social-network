'use client';

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { GroupType } from '../page';
import { GroupDetails } from './_components/group-details';
import { GroupInvite } from './_components/group-invite';
import { RequestButton } from './_components/buttons';

interface GroupQueryResponse {
  group: GroupType;
}

export default function GroupPage({ params }: { params: { id: string } }) {
  // Fetches the group details
  const groupQuery = useQuery<GroupQueryResponse>({
    queryKey: ['group'],
    queryFn: () => fetcher(`/api/groups/${params.id}`),
  });

  // Returns error if user is not a member of the group
  const isMemberQuery = useQuery({
    queryKey: ['isMember', params.id],
    queryFn: () => fetcher(`/api/groups/${params.id}/members`),
    enabled: !!groupQuery.data, // only request if group is found
    retry: 1,
  });

  if (groupQuery.isLoading || isMemberQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!groupQuery.data) {
    return <div>Group not found</div>;
  }

  return (
    <div className='flex flex-col'>
      <GroupDetails title={groupQuery.data.group.title} description={groupQuery.data.group.description} />
      <div>{!isMemberQuery.data ? <RequestButton group_id={params.id} /> : <GroupInvite group_id={params.id} />}</div>
    </div>
  );
}
