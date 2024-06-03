'use client';

import { CreatePost } from './_components/create-post';
import { fetcher } from '@/lib/fetchers';
import { Post } from '@/components/post/post';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { PostType } from '@/components/post/post';
import { useEffect, useState } from 'react';
import { useGetFeedPostsQuery } from '@/services/backend/actions/posts';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);

  const { isLoading, data } = useGetFeedPostsQuery();

  useEffect(() => {
    if (data?.posts) {
      setPosts(data.posts);
    }
  }, [data?.posts]);

  const populateFeed = (post: PostType, action: 'update' | 'create') => {
    setPosts((posts) => [post, ...posts]);
  };

  if (isLoading) {
    return (
      <div className='flex flex-col space-y-5'>
        <Post isLoading={true} />
        <Post isLoading={true} />
        <Post isLoading={true} />
      </div>
    );
  }

  return (
    <div>
      <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
        <div className='aspect-square w-[50px] rounded-full bg-secondary' />
        <CreatePost callback={populateFeed}>
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </CreatePost>
      </div>
      {posts && (
        <div className='mt-5 flex flex-col space-y-5'>
          {posts.map((post: PostType) => (
            <Post key={post.id} postData={post} isLoading={false} />
          ))}
        </div>
      )}
    </div>
  );
}
