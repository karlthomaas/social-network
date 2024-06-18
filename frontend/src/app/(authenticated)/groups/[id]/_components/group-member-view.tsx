import { GroupInvite } from './group-invite';
import { GroupLeaveButton } from './group-leave-button';
import { CreateEvent } from '@/components/event/create-event';
import { GroupJoinRequests } from './group-join-requests';
import { CreatePost } from '@/app/(authenticated)/home/_components/create-post';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GroupFeed } from './group-feed';
import { EventsModal } from '@/components/event/events-modal';
import { PostType } from '@/components/post/post';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useGetGroupPostsQuery } from '@/services/backend/actions/posts';
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';

export const GroupMemberView = ({ id }: { id: string }) => {
  const group = useAppSelector((state) => state.groups.groups[id]);
  const groupId = group.group.id;

  const { user } = useAppSelector((state) => state.auth);
  const isOwner = group.group.user_id === user?.id;

  const [posts, setPosts] = useState<PostType[]>([]);
  const { data } = useGetGroupPostsQuery(groupId);

  useEffect(() => {
    if (data?.group_posts) {
      setPosts(data.group_posts);
    }
  }, [data]);

  const updatePosts = (response: PostType, action: 'update' | 'create') => {
    if (action === 'update') {
      setPosts((posts) => posts.map((post) => (post.id === response.id ? response : post)));
    } else {
      setPosts((posts) => [response, ...posts]);
    }
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
        <ProfilePicture url={user?.image} className='size-[50px] rounded-full bg-secondary' />
        <CreatePost callback={updatePosts} groupId={id}>
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </CreatePost>
      </div>
      <div>
        <GroupFeed userId={user?.id} posts={posts} groupId={groupId} />
      </div>
    </>
  );
};
