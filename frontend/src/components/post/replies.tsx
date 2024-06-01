import { LoadingSpinner } from '../ui/spinners';
import { useEffect, useState } from 'react';
import { Reply } from './reply';

import { useGetPostRepliesQuery } from '@/services/backend/actions/replies';
import { useAppSelector } from '@/lib/hooks';
import { UserType } from '@/features/auth/types';

export interface ReactionType {
  id: string;
  user_id: string;
  reply_id: string;
}

export interface ReplyType {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  user: UserType;
  reactions: number;
  reaction: ReactionType;
}

export const Replies = ({ post_id, newReply }: { post_id: string; newReply: ReplyType | null }) => {
  const { isLoading, isError, data } = useGetPostRepliesQuery(post_id)
  const { user } = useAppSelector((state) => state.auth);
  const [replies, setReplies] = useState<ReplyType[]>([]);

  useEffect(() => {
    if (data?.replies) {
      setReplies(data.replies);
    }
  }, [data]);

  useEffect(() => {
    if (newReply) {
      setReplies((prevReplies) => [...prevReplies, newReply]);
    }
  }, [newReply]);

  if (isLoading) {
    return (
      <div className='mx-auto my-4 w-max'>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <p className='mb-3 text-center text-neutral-300'>Failed to load comments</p>;
  }

  if (replies.length === 0) {
    return <p className='mb-3 text-center text-neutral-300'>No comments yet</p>;
  }

  return (
    <div className='mb-5 flex w-full flex-col space-y-3 pt-5'>
      {replies.map((reply: ReplyType) => (
        <Reply key={reply.id} postId={post_id} reply={reply} isAuthor={user?.id === reply.user_id} />
      ))}
    </div>
  );
};
