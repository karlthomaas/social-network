import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/components/post/post';

export const PostFeedSkeleton = ({ showCreatePostBar = true }) => {
  return (
    <div className='flex flex-col space-y-5'>
      {showCreatePostBar && <Skeleton className='h-[80px] w-full rounded-xl' />}
      <Post isLoading={true} isAuthor={false} />
      <Post isLoading={true} isAuthor={false} />
      <Post isLoading={true} isAuthor={false} />
    </div>
  );
};
