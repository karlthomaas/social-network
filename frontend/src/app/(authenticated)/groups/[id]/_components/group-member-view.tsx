import { UserType } from '@/providers/user-provider';
import { GroupType } from '../../page';
import { GroupInvite } from './group-invite';
import { GroupLeaveButton } from './group-leave-button';
import { CreateEvent } from '@/components/event/create-event';
import { GroupJoinRequests } from './group-join-requests';
import { CreatePost } from '@/app/(authenticated)/home/_components/create-post';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroupFeed } from './group-feed';
import { EventsModal } from '@/components/event/events-modal';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { PostType } from '@/components/post/post';
import { useEffect, useState } from 'react';

interface GroupFeedResponse {
  group_posts: PostType[];
}

export const GroupMemberView = ({ user, group, isOwner }: { user: null | UserType; group: GroupType; isOwner: boolean }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { data } = useQuery<GroupFeedResponse>({
    queryKey: ['group-feed', group.id],
    queryFn: () => fetcher(`/api/groups/${group.id}/posts`),
  });

  useEffect(() => {
    if (data?.group_posts) {
      setPosts(data.group_posts);
    }
  }, [data]);

  const handlePopulateFeed = (post: PostType) => {
    setPosts((posts) => [post, ...posts]);
  };

  return (
    <>
      <div className='flex space-x-2'>
        <GroupInvite groupId={group.id} />
        {!isOwner && user && <GroupLeaveButton groupId={group.id} userId={user.id} />}
        <CreateEvent groupId={group.id} />
        <EventsModal group={group} />
        {isOwner && <GroupJoinRequests groupId={group.id} />}
      </div>
      <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
        <div className='aspect-square w-[50px] rounded-full bg-secondary' />
        <CreatePost callback={handlePopulateFeed} mutationKeys={['group-feed']} group={group}>
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </CreatePost>
      </div>
      <div>
        <GroupFeed posts={posts} groupId={group.id} />
      </div>
    </>
  );
};
