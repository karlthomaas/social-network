import { ProfilePicture } from './pfp';
import { FollowBtn } from '@/components/buttons/follow-btn';
import { PrivacyBtn } from './privacy';
import { useGetUserDetailsQuery } from '@/services/backend/actions/user';
import { useAppSelector } from '@/lib/hooks';
import { SettingsBtn } from '@/app/(authenticated)/profile/[user]/_components/settings';
import { Skeleton } from '@/components/ui/skeleton';

export const UserDetails = ({ username }: { username: string }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetUserDetailsQuery(username);

  if (isLoading || !data || !data.user) {
    return (
      <div className='flex -translate-y-[50px] flex-col  space-y-3'>
        <Skeleton className='z-20 mb-5 size-[126px] rounded-full' />
        <Skeleton className='h-[25px] w-[100px]' />
        <Skeleton className='h-[25px] w-[120px]' />
        <Skeleton className='h-[25px] w-[90px]' />
      </div>
    );
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
          <p className='mt-5 text-sm text-neutral-400'>{profileUser.privacy}</p>
        </div>
      </div>

      <div className='mr-4 mt-2 flex'>
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
