'use client';

import { Banner } from './_components/banner';
import { UserDetails } from './_components/user-details';
import { ProfilePosts } from './_components/posts';

export default function Profile({ params }: { params: { user: string } }) {
  return (
    <div>
      <Banner />
      <UserDetails username={params.user} />
      <ProfilePosts username={params.user} />
    </div>
  );
}
