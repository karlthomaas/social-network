import { Skeleton } from '../ui/skeleton';
import { CommentButton, LikeButton, ShareButton } from './post_buttons';
import { Replies, ReplyType } from './replies';
import { UserType } from '@/features/auth/types';
import { useState } from 'react';
import { ReplyInput } from './reply-input';
import { PostOptions } from './post-options';
import { formatDistanceToNowStrict } from 'date-fns';
import { Globe, Lock } from 'lucide-react';
import Image from 'next/image';
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import Link from 'next/link';
import { PostReply } from '@/components/post/post-reply';

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

export const Post = ({ isAuthor, postData, isLoading }: { isAuthor: boolean; postData?: PostType; isLoading: boolean }) => {
  const [post, setPost] = useState<PostType | undefined>(postData);
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
    <div id={post.id} className='h-max w-full rounded-xl border  px-6 pt-6'>
      <div className='mb-2 flex justify-between'>
        <div className='flex items-center space-x-2'>
          <ProfilePicture url={post.user.image} className='size-[50px]' />
          <div className='flex flex-col'>
            <Link href={`/profile/${post.user.nickname}`} className='capitalize underline-offset-2 hover:underline'>
              {post.user.first_name} {post.user.last_name}
            </Link>
            <div className='flex items-center space-x-1 text-neutral-400'>
              <p className='text-sm '>{formatDistanceToNowStrict(new Date(post.updated_at), { addSuffix: true })}</p>
              {privacyIcon}
            </div>
          </div>
        </div>
        {isAuthor && <PostOptions post={post} setPost={setPost} />}
      </div>
      <p className='ml-1'>{post.content}</p>
      {post.image && (
        <Image className='mt-3 rounded-lg' alt='pilt' src={`http://localhost:4000${post.image}`} height={200} width={300} unoptimized />
      )}
      <div className='mb-3 mt-10 flex justify-evenly border-y '>
        <LikeButton reactions={post.reactions} likeStatus={likeStatus} type='post' postId={post.id} reactionId={post.reaction.id} />
        <CommentButton onClick={() => setShowComments(!showComments)} />
      </div>
      {showComments && <PostReply postId={post.id} />}
    </div>
  );
};
