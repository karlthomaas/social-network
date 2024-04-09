import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfilePicture } from './pfp';
import { FollowBtn } from '@/components/buttons/follow-btn';

export const UserDetails = ({ username }: { username: string }) => {
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: async () => fetcher(`/api/users/${username}`),
  // });

  // if (isLoading) {
  //   return (
  //     <div className='flex flex-col'>
  //       <div className='h-[40px] w-[150px] animate-pulse bg-slate-600' />
  //     </div>
  //   );
  // }

  // if (data) {
  //   return (
  //     <div className='flex flex-col'>
  //       <Skeleton className='h-[20px] w-[100px] rounded-xl' />
  //     </div>
  //   );
  // }
  // console.log(data);
  return (
    <div className='flex '>
      <ProfilePicture className='relative left-8 -translate-y-1/3 bg-slate-600' />
      <div className='ml-10'>
        <h3 className='text-lg'>John doe</h3>
        <p>100 followers</p>
      </div>

      <FollowBtn className="ml-5 mt-2" user_id='1' follow_state={true} />
    </div>
  );
};
