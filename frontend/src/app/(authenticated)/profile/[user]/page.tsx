'use client';

import { Banner } from './_components/banner';
import { UserDetails } from './_components/user-details';
import { ProfilePosts } from './_components/posts';
import { FollowersCount } from './_components/followers-count';
import { CreatePost } from '../../home/_components/create-post';
import { useSession } from '@/providers/user-provider';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@radix-ui/react-dialog';

export default function Profile({ params }: { params: { user: string } }) {
  const { user } = useSession();
  return (
    <div>
      <Banner />
      <UserDetails username={params.user} />
      <div className='ml-10'>
        <FollowersCount username={params.user} />
      </div>
      <div className='mt-10 flex flex-col space-y-3'>
        {user?.nickname === params.user && (
          <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
            <div className='aspect-square w-[50px] rounded-full bg-secondary' />
            <CreatePost callback={() => {}}>
              <DialogTrigger asChild>
                <Button className='ml-3 w-full justify-start' variant='outline'>
                  What's on your mind?
                </Button>
              </DialogTrigger>
            </CreatePost>
          </div>
        )}
        <ProfilePosts username={params.user} />
      </div>
    </div>
  );
}
