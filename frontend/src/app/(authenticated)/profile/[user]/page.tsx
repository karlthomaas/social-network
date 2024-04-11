'use client';

import { Banner } from './_components/banner';
import { UserDetails } from './_components/user-details';
import { ProfilePosts } from './_components/posts';
import { FollowersCount } from './_components/followers-count';
import { CreatePost } from '../../home/_components/create-post';
import { useSession } from '@/providers/user-provider';

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
        {user?.nickname === params.user && <CreatePost />}
        <ProfilePosts username={params.user} />
      </div>
    </div>
  );
}
