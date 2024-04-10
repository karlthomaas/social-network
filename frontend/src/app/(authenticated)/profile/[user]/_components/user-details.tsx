import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfilePicture } from './pfp';
import { FollowBtn } from '@/components/buttons/follow-btn';
import { PrivacyBtn } from './privacy';
import { useSesssion } from '@/providers/user-provider';

export const UserDetails = ({ username }: { username: string }) => {
  const { user } = useSesssion();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => fetcher(`/api/users/${username}`),
  });

  if (isLoading || !data || !data.user) {
    return (
      <div className='flex flex-col'>
        <div className='h-[40px] w-[150px] animate-pulse bg-slate-600' />
      </div>
    );
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  const profileUser = data.user;
  const isUserProfile = user?.id === profileUser.id;
  
  return (
    <div className='flex '>
      <ProfilePicture className='relative left-8 -translate-y-1/3 bg-slate-600' />
      <div className='ml-10'>
        <h3 className='text-lg'>{`${profileUser.first_name} ${profileUser.last_name}`}</h3>
        <p>TODO followers</p>
      </div>

      {!isUserProfile && <FollowBtn className='ml-5 mt-2' user_id='1' follow_state={true} />}
      {isUserProfile && <PrivacyBtn privacy_state={profileUser.privacy} />}
    </div>
  );
};
