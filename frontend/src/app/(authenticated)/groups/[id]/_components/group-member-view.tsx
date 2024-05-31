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
import { useAppSelector } from '@/lib/hooks';

interface GroupFeedResponse {
  group_posts: PostType[];
}

export const GroupMemberView = ({ id }: { id: string }) => {
  const group = useAppSelector((state) => state.groups.groups[id]);
  const groupId = group.group.id;

  const { user } = useAppSelector((state) => state.auth);
  const isOwner = group.group.user_id === user?.id;

  const [posts, setPosts] = useState<PostType[]>([]);
  const { data } = useQuery<GroupFeedResponse>({
    queryKey: ['group-feed', groupId],
    queryFn: () => fetcher(`/api/groups/${groupId}/posts`),
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
        <GroupInvite groupId={groupId} />
        {!isOwner && user && <GroupLeaveButton id={id} />}
        <CreateEvent groupId={groupId} />
        <EventsModal group={group.group} />
        {isOwner && <GroupJoinRequests id={groupId} />}
      </div>
      <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
        <div className='aspect-square w-[50px] rounded-full bg-secondary' />
        <CreatePost callback={handlePopulateFeed} groupId={id}>
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </CreatePost>
      </div>
      <div>
        <GroupFeed posts={posts} groupId={groupId} />
      </div>
    </>
  );
};
