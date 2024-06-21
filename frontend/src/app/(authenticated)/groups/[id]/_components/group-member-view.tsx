import { GroupInvite } from './group-invite';
import { GroupLeaveButton } from './group-leave-button';
import { CreateEvent } from '@/components/event/create-event';
import { GroupJoinRequests } from './group-join-requests';
import { GroupFeed } from './group-feed';
import { EventsModal } from '@/components/event/events-modal';
import { PostType } from '@/components/post/post';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useGetGroupPostsQuery } from '@/services/backend/actions/posts';
import { CreatePostBar } from '@/components/post/create-post-bar';
import { PostFeedSkeleton } from '@/components/skeletons/post-feed';

export const GroupMemberView = ({ id }: { id: string }) => {
  const group = useAppSelector((state) => state.groups.groups[id]);
  const groupId = group.group.id;

  const { user } = useAppSelector((state) => state.auth);
  const isOwner = group.group.user_id === user?.id;

  const [posts, setPosts] = useState<PostType[]>([]);
  const { data, isLoading } = useGetGroupPostsQuery(groupId);

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
      <CreatePostBar image={user?.image} callback={updatePosts} />
      <div>{isLoading ? <PostFeedSkeleton /> : <GroupFeed userId={user?.id} posts={posts} groupId={groupId} />}</div>
    </>
  );
};
