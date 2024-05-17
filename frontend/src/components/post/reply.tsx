'use client';

import { ReplyType, ReactionType } from './replies';

import { formatDistanceToNowStrict } from 'date-fns';
import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { fetcherWithOptions } from '@/lib/fetchers';

import { useMutation } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { ReplyInput } from './reply-input';
import { useRef } from 'react';
import { ReplyOptions } from './reply-optionts';

export const Reply = ({ postId, reply, isAuthor }: { postId: string; reply: ReplyType; isAuthor: boolean }) => {
  const [reactions, setReactions] = useState(reply.reactions);
  const [isLiked, setIsLiked] = useState(reply.reaction.id ? true : false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [editState, setEditState] = useState(false);
  const [replyContent, setReplyContent] = useState(reply.content);

  const replyRef = useRef(reply);

  const handleReaction = async () => {
    if (isLiked) {
      setReactions(reactions - 1);
      setIsLiked(false);
    } else {
      setReactions(reactions + 1);
      setIsLiked(true);
    }

    reactMutation.mutate(!isLiked);
  };

  const reactMutation = useMutation({
    mutationFn: async (like: boolean) => {
      const method = like ? 'POST' : 'DELETE';
      const url = like
        ? `/api/posts/${postId}/replies/${reply.id}/reactions`
        : `/api/posts/${postId}/replies/${reply.id}/reactions/${replyRef.current.reaction.id}`;
      return fetcherWithOptions({
        url: url,
        method: method,
        body: {},
      });
    },

    onSuccess: (data: { [key: string]: ReactionType }) => {
      if (isLiked) {
        replyRef.current.reaction = data.reaction;
      } else {
        replyRef.current.reaction = { id: '', user_id: '', reply_id: '' };
      }
    },
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      return fetcherWithOptions({
        url: `/api/posts/${postId}/reply/${reply.id}`,
        method: 'DELETE',
        body: {},
      });
    },
    onError: (error) => {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Reply has been deleted!',
      });
      setIsDeleted(true);
    },
  });

  const onReplyEdit = (data: any) => {
    setEditState(false);
    setReplyContent(data.content);
  };

  const onReplyEditCancel = () => {
    setEditState(false);
  };

  if (isDeleted) {
    return null;
  }

  if (editState) {
    return <ReplyInput postId={postId} replyId={reply.id} replyInput={reply.content} onCancel={onReplyEditCancel} callback={onReplyEdit} />;
  }

  return (
    <div key={reply.id} className='group flex w-full space-x-6 '>
      <div id='pfp' className='size-[40px] flex-none rounded-full bg-secondary ' />
      <div className='flex w-max max-w-[calc(100%-110px)] flex-col space-y-1'>
        <div className='relative flex space-x-3'>
          <div className='flex w-max min-w-[250px] flex-col rounded-xl bg-secondary p-2'>
            <h1 className='font-medium capitalize'>{`${reply.user.first_name} ${reply.user.last_name}`}</h1>
            <p className='break-all'>{replyContent}</p>
          </div>
          {isAuthor && (
            <ReplyOptions
              handleDelete={() => replyMutation.mutate()}
              handleEdit={() => {
                setEditState(true);
              }}
            />
          )}
        </div>
        <div
          className={cn('mr-5 mt-1 flex', {
            'mr-14': isAuthor, // add more margin because author replies are wider than usual
          })}
        >
          <div>{formatDistanceToNowStrict(new Date(reply.updated_at), { addSuffix: true })} |</div>
          <div onClick={handleReaction} className={cn('ml-4 font-medium hover:cursor-pointer hover:underline', isLiked && 'text-primary')}>
            Like
          </div>
          {reactions > 0 && (
            <div className='ml-auto flex items-center justify-end'>
              {reactions} <ThumbsUp size={20} className='ml-2 inline-flex' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
