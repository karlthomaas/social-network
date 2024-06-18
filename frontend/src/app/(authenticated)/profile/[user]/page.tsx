'use client';

import { Banner } from './_components/banner';
import { UserDetails } from './_components/user-details';
import { ProfilePosts } from './_components/posts';
import { FollowersCount } from './_components/followers-count';
import { CreatePost } from '../../home/_components/create-post';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useAppSelector } from '@/lib/hooks';
import type { PostType } from '@/components/post/post';
import { useEffect, useState } from 'react';
import { useGetUserPostsQuery } from '@/services/backend/actions/posts';
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { FollowingList } from '@/app/(authenticated)/profile/[user]/_components/following-list';

export default function Profile({ params }: { params: { user: string } }) {
  const { isLoading, data } = useGetUserPostsQuery(params.user);
  const [posts, setPosts] = useState<PostType[]>([]);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (data && data.posts) {
      setPosts(data.posts);
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
    <div>
      <Banner />
      <div className='ml-5'>
        <UserDetails username={params.user} />
        <div className='flex space-x-4'>
          <FollowersCount username={params.user} />
          <FollowingList username={params.user} />
        </div>
      </div>
      <div className='mt-10 flex flex-col space-y-3'>
        {user?.nickname === params.user && (
          <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
            <ProfilePicture url={user.image} className='size-[50px] rounded-full bg-secondary' />
            <CreatePost callback={updatePosts}>
              <DialogTrigger asChild>
                <Button className='ml-3 w-full justify-start' variant='outline'>
                  What's on your mind?
                </Button>
              </DialogTrigger>
            </CreatePost>
          </div>
        )}
        <ProfilePosts posts={posts} isAuthor={user?.nickname === params.user} isLoading={isLoading} />
      </div>
    </div>
  );
}
