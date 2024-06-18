import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { FollowerType } from '@/services/backend/types';
import Link from 'next/link';

export const FollowListItem = ({ follower }: { follower: FollowerType }) => {
  return (
    <Link
      href={`/profile/${follower.user.nickname}`}
      className='flex h-max w-full items-center space-x-2 rounded-lg border border-border p-4 hover:cursor-pointer hover:bg-secondary/50'
    >
      <ProfilePicture url={follower.user.image} className='size-[50px]' />
      <p className='capitalize'>
        {follower.user.first_name} {follower.user.last_name}
      </p>
    </Link>
  );
};
