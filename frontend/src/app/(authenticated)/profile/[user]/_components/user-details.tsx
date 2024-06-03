import { ProfilePicture } from './pfp';
import { FollowBtn } from '@/components/buttons/follow-btn';
import { PrivacyBtn } from './privacy';
import { useGetUserDetailsQuery } from '@/services/backend/actions/user';
import { useAppSelector } from '@/lib/hooks';

export const UserDetails = ({ username }: { username: string }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetUserDetailsQuery(username);

  if (isLoading || !data || !data.user) {
    // todo add loading state
    return null;
  }

  const profileUser = data.user;
  const isUserProfile = user?.id === profileUser.id;

  return (
    <div className='flex w-full'>
      <ProfilePicture className='relative left-8 -translate-y-1/3 bg-slate-600' />
      <div className='ml-10 mt-2 flex w-full justify-between'>
        <h3 className='text-lg'>{`${profileUser.first_name} ${profileUser.last_name}`}</h3>

        {!isUserProfile && <FollowBtn user_id={profileUser.id} />}
        {isUserProfile && <PrivacyBtn privacy_state={profileUser.privacy} />}
      </div>
    </div>
  );
};
