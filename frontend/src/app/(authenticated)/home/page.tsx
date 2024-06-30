'use client';

import { Post } from '@/components/post/post';
import { PostType } from '@/components/post/post';
import { useEffect, useState } from 'react';
import { useGetFeedPostsQuery } from '@/services/backend/actions/posts';
import { useAppSelector } from '@/lib/hooks';
import { CreatePostBar } from '@/components/post/create-post-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { PostFeedSkeleton } from '@/components/skeletons/post-feed';

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<PostType[]>([]);
  const { isLoading, data } = useGetFeedPostsQuery();

  useEffect(() => {
    if (data?.posts) {
      setPosts(data.posts);
    }
  }, [data?.posts]);

  const updatePosts = (response: PostType, action: 'update' | 'create') => {
    if (action === 'update') {
      setPosts((posts) => posts.map((post) => (post.id === response.id ? response : post)));
    } else {
      setPosts((posts) => [response, ...posts]);
    }
  };

  if (isLoading) {
    return <PostFeedSkeleton />;
  }

  return (
    <div>
      <CreatePostBar image={user?.image} callback={updatePosts} />
      {posts && (
        <div className='mt-5 flex flex-col space-y-5'>
          {posts.map((post: PostType) => (
            <Post key={post.id} postData={post} isAuthor={post.user_id === user?.id} isLoading={false} />
          ))}
        </div>
      )}
    </div>
  );
}
