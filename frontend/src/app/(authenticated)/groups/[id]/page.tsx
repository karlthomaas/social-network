'use client';

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { GroupType } from '../page';
import { GroupDetails } from './_components/group-details';
import { GroupInvite } from './_components/group-invite';
import { RequestButton } from './_components/buttons';
import { GroupJoinRequests } from './_components/group-join-requests';
import { useSession } from '@/providers/user-provider';
import { useEffect, useState } from 'react';
import { GroupLeaveButton } from './_components/group-leave-button';
import { CreatePost } from '../../home/_components/create-post';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroupFeed } from './_components/group-feed';
import { CreateEvent } from '@/components/event/create-event';

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
      <div className='flex space-x-2'>
        {isMember ? <GroupInvite groupId={params.id} /> : <RequestButton groupId={params.id} />}
        {!isOwner && isMember && <GroupLeaveButton groupId={params.id} userId={user?.id} />}
        {isMember && <CreateEvent groupId={params.id} />}
        {isOwner && <GroupJoinRequests groupId={params.id} />}
      </div>
      <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
        <div className='aspect-square w-[50px] rounded-full bg-secondary' />
        <CreatePost mutationKeys={['group-feed']} group={groupQuery.data.group}>
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </CreatePost>
      </div>
      <div>
        <GroupFeed groupId={params.id} />
      </div>
    </div>
  );
}
