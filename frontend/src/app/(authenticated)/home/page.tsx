'use client';

import { CreatePost } from './_components/create-post';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { Post } from '@/components/post/post';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

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
      <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
        <div className='aspect-square w-[50px] rounded-full bg-secondary' />
        <CreatePost>
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </CreatePost>
      </div>
      {data && (
        <div className='mt-5 flex flex-col space-y-5'>
          {data.posts.map((post: any) => (
            <Post key={post.id} post={post} isLoading={false} />
          ))}
        </div>
      )}
    </div>
  );
}
