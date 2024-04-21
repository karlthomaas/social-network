import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { EllipsisVertical } from 'lucide-react';
import { CommentButton, LikeButton, ShareButton } from './post_buttons';
import { Comments } from './comments';
import { Reply } from './reply';
import type { User } from '@/providers/user-provider'
import { useState } from 'react';
import { create } from 'zustand';
interface Reaction {
  id: string;
  user_id: string;
  post_id: string;
  reply_id: string;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  image: string;
  privacy: ['public', 'private', 'almost_private'];
  created_at: string;
  updated_at: string;
  user: User;
  reaction: Reaction;
  reactions: number;
}

export const Post = ({ post, isLoading }: { post?: Post , isLoading: boolean }) => {
  if (isLoading || !post) {
    return <Skeleton className='h-[340px] w-full rounded-xl' />;
  }
  const likeStatus = post.reaction.id ? true : false;
  
  return (
    <div className='h-max w-full rounded-xl border border-border px-6 pt-6'>
      <div className='flex justify-between mb-2'>
        <div className='flex items-center space-x-2'>
          <div className='aspect-square h-[50px] rounded-full bg-secondary' />
          <p className='capitalize'>{post.user.first_name} {post.user.last_name} </p>
        </div>
          <Button size='icon' variant='ghost'>
            <EllipsisVertical />
          </Button>
      </div>
      <text className='ml-1'>
        {post.content}
      </text>
      <div className='flex border-border border-y justify-evenly mt-10 mb-3'>
        <LikeButton reactions={post.reactions}likeStatus={likeStatus} type="post" postId={post.id} reactionId={post.reaction.id} />
        <CommentButton />
        <ShareButton link='' />
      </div>
      <Comments comments={[]} />
      <Reply post={post} />
    </div>
  );
};
