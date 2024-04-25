'use client';

import { ReplyType } from './replies';

import { formatDistanceToNowStrict } from 'date-fns';
import { EllipsisVertical, Pencil, ThumbsUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { fetcherWithOptions } from '@/lib/fetchers';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { ReplyInput } from './reply-input';

export const Reply = ({ postId, reply, isAuthor }: { postId: string; reply: ReplyType; isAuthor: boolean }) => {
  const [reactions, setReactions] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [editState, setEditState] = useState(false);
  const [replyContent, setReplyContent] = useState(reply.content);

  const handleReaction = async () => {
    if (isLiked) {
      setReactions(reactions - 1);
      setIsLiked(false);
    } else {
      setReactions(reactions + 1);
      setIsLiked(true);
    }
  };

  const mutation = useMutation({
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
          <div className='flex w-max flex-col rounded-xl bg-secondary p-2'>
            <h1 className='font-medium'>{reply.user_id}</h1>
            <p className='break-all '>{replyContent}</p>
          </div>
          {isAuthor && (
            <ReplyOptions
              handleDelete={() => mutation.mutate()}
              handleEdit={() => {
                setEditState(true);
              }}
            />
          )}
        </div>
        <div className='mr-14 flex'>
          <div>{formatDistanceToNowStrict(new Date(reply.created_at), { addSuffix: true })} |</div>
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

const ReplyOptions = ({ handleDelete, handleEdit }: { handleDelete: () => void; handleEdit: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        onClick={() => {
          console.log('click');
        }}
        className={cn('invisible group-hover:visible', isOpen && 'visible')}
      >
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[200px]'>
        <DropdownMenuItem className='hover:cursor-pointer' onClick={handleDelete}>
          <Trash2 className='mr-2' /> Delete
        </DropdownMenuItem>
        <DropdownMenuItem className='hover:cursor-pointer' onClick={handleEdit}>
          <Pencil className='mr-2' onClick={handleEdit} /> Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
