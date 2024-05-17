import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { ProfilePicture } from './pfp';
import { FollowBtn } from '@/components/buttons/follow-btn';
import { PrivacyBtn } from './privacy';
import { useSession } from '@/providers/user-provider';

export const UserDetails = ({ username }: { username: string }) => {
  const { user } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => fetcher(`/api/users/${username}`),
  });

  if (isLoading || !data || !data.user) {
    return (
      null
    );
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
