import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { EllipsisVertical } from 'lucide-react';
import { CommentButton, LikeButton, ShareButton } from './buttons';
import { Comments } from './comments';
import { Reply } from './reply';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image: string;
  user: any;
  privacy: ['public', 'private', 'almost_private'];
  created_at: string;
  updated_at: string;
}

export const Post = ({ post, isLoading }: { post?: Post , isLoading: boolean }) => {
  if (isLoading || !post) {
    return <Skeleton className='h-[340px] w-full rounded-xl' />;
  }
  return (
    <div className='h-max w-full rounded-xl border border-border px-6 pt-6'>
      <div className='flex justify-between mb-2'>
        <div className='flex items-center space-x-2'>
          <div className='aspect-square h-[50px] rounded-full bg-secondary' />
          <p>John Doe </p>
        </div>
          <Button size='icon' variant='ghost'>
            <EllipsisVertical />
          </Button>
      </div>
      <text className='ml-1'>
        {post.content}
      </text>
      <div className='flex border-border border-y justify-evenly mt-10 mb-3'>
        <LikeButton postId={post.id} />
        <CommentButton />
        <ShareButton link='' />
      </div>
      <Comments comments={[]} />
      <Reply post={post} />
    </div>
  );
};
