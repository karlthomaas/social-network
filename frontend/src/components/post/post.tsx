import { Skeleton } from '../ui/skeleton';
import { CommentButton, LikeButton, ShareButton } from './post_buttons';
import { Replies, ReplyType } from './replies';
import { UserType } from '@/features/auth/types';
import { useState } from 'react';
import { ReplyInput } from './reply-input';
import { PostOptions } from './post-options';
import { formatDistanceToNowStrict } from 'date-fns';
import { Globe, Lock } from 'lucide-react';

interface Reaction {
  id: string;
  user_id: string;
  post_id: string;
  reply_id: string;
}

export interface PostType {
  id: string;
  user_id: string;
  content: string;
  image: string;
  privacy: 'public' | 'private' | 'almost_private';
  created_at: string;
  updated_at: string;
  user: UserType;
  reaction: Reaction;
  reactions: number;
}

export const Post = ({ postData, isLoading }: { postData?: PostType; isLoading: boolean }) => {
  const [post, setPost] = useState<PostType | undefined>(postData);
  const [newReply, setNewReply] = useState<ReplyType | null>(null);
  const [showComments, setShowComments] = useState(false);

  if (isLoading) {
    return <Skeleton className='h-[340px] w-full rounded-xl' />;
  }

  if (!post) {
    return null;
  }

  const likeStatus = post.reaction.id ? true : false;
  const privacyIcon = post.privacy === 'public' ? <Globe size={15} /> : <Lock size={15} />;

  return (
    <div className='h-max w-full rounded-xl border border-border px-6 pt-6'>
      <div className='mb-2 flex justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='aspect-square h-[50px] rounded-full bg-secondary' />
          <div className='flex flex-col'>
            <p className='capitalize'>
              {post.user.first_name} {post.user.last_name}{' '}
            </p>
            <div className='flex items-center space-x-1 text-neutral-400'>
              <p className='text-sm '>{formatDistanceToNowStrict(new Date(post.updated_at), { addSuffix: true })}</p>
              {privacyIcon}
            </div>
          </div>
        </div>
        <PostOptions post={post} setPost={setPost} />
      </div>
      <p className='ml-1'>{post.content}</p>
      <div className='mb-3 mt-10 flex justify-evenly border-y border-border'>
        <LikeButton reactions={post.reactions} likeStatus={likeStatus} type='post' postId={post.id} reactionId={post.reaction.id} />
        <CommentButton onClick={async () => setShowComments(!showComments)} />
        <ShareButton link='' />
      </div>
      {showComments && (
        <>
          <Replies post_id={post.id} newReply={newReply} />
          <ReplyInput postId={post.id} setNewReply={setNewReply} />
        </>
      )}
    </div>
  );
};
