"use client";

import { CreatePost } from './_components/create-post';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { Post } from '@/components/post/post';

export default function Home() {
  const { isLoading, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetcher('/api/posts/feed'),
  });

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
      <CreatePost />
      {data && (
        <div className='flex flex-col space-y-5 mt-5'>
          {data.posts.map((post: any) => (
            <Post key={post.id} post={post} isLoading={false} />
          ))}
        </div>
      )}
    </div>
  );
}
