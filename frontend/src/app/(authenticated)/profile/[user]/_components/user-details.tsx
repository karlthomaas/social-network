import { ProfilePicture } from './pfp';
import { FollowBtn } from '@/components/buttons/follow-btn';
import { PrivacyBtn } from './privacy';
import { useGetUserDetailsQuery } from '@/services/backend/actions/user';
import { useAppSelector } from '@/lib/hooks';
import { SettingsBtn } from '@/app/(authenticated)/profile/[user]/_components/settings';

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
    <div className='flex justify-between'>
      <div className='flex w-full -translate-y-[50px] flex-col space-y-5'>
        <ProfilePicture url={profileUser.image} />
        <div className='flex flex-col space-y-1'>
          <h3 className='text-xl font-semibold'>{`${profileUser.first_name} ${profileUser.last_name}`}</h3>
          <h4 className='font-medium text-neutral-400'>@{profileUser.nickname}</h4>
          <p className='mt-5 text-sm'>{profileUser.about_me}</p>
        </div>
      </div>

      <div className='mt-2 flex'>
        {!isUserProfile ? (
          <FollowBtn user_id={profileUser.id} />
        ) : (
          <div className='flex space-x-2'>
            <PrivacyBtn privacy_state={profileUser.privacy} />
            <SettingsBtn />
          </div>
        )}
      </div>
    </div>
  );
};
