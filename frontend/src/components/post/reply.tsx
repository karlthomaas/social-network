'use client';

import { ReplyType } from './replies';

import { formatDistanceToNowStrict } from 'date-fns';
import { ThumbsUp } from 'lucide-react';
import { useReducer } from 'react';
import { cn } from '@/lib/utils';

import { toast } from '../ui/use-toast';
import { ReplyInput } from './reply-input';
import { useRef } from 'react';
import { ReplyOptions } from './reply-optionts';
import {
  useCreateReplyReactionMutation,
  useDeletePostReplyMutation,
  useDeleteReplyReactionMutation,
} from '@/services/backend/actions/replies';
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';

enum ReplyActionTypes {
  LIKE = 'LIKE',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  SUBMIT_EDIT = 'SUBMIT_EDIT',
}
interface ReplyState {
  isLiked: boolean;
  replyContent: string;
  reactions: number;
  isDeleted: boolean;
  editState: boolean;
}

const replyReducer = (state: ReplyState, action: { type: ReplyActionTypes; payload: any }) => {
  switch (action.type) {
    case ReplyActionTypes.LIKE:
      return {
        ...state,
        isLiked: action.payload,
        reactions: action.payload ? state.reactions + 1 : state.reactions - 1,
      };
    case ReplyActionTypes.DELETE:
      return {
        ...state,
        isDeleted: action.payload,
      };
    case ReplyActionTypes.SUBMIT_EDIT:
      return {
        ...state,
        editState: false,
        replyContent: action.payload,
      };
    case ReplyActionTypes.EDIT:
      return {
        ...state,
        editState: true,
      };
  }
};

export const Reply = ({ postId, reply, isAuthor }: { postId: string; reply: ReplyType; isAuthor: boolean }) => {
  const [deleteReply] = useDeletePostReplyMutation();
  const [deleteReaction] = useDeleteReplyReactionMutation();
  const [createReaction] = useCreateReplyReactionMutation();

  const [state, dispatch] = useReducer(replyReducer, {
    isLiked: reply.reaction.id ? true : false,
    replyContent: reply.content,
    reactions: reply.reactions,
    isDeleted: false,
    editState: false,
  });

  const replyRef = useRef(reply);

  const handleReaction = async () => {
    if (state.isLiked) {
      dispatch({ type: ReplyActionTypes.LIKE, payload: false });
    } else {
      dispatch({ type: ReplyActionTypes.LIKE, payload: true });
    }

    try {
      if (state.isLiked) {
        await deleteReaction({ postId, replyId: reply.id, reactionId: replyRef.current.reaction.id });
        replyRef.current = { ...replyRef.current, reaction: { id: '', user_id: '', reply_id: '' } };
      } else {
        const data = await createReaction({ postId, replyId: reply.id }).unwrap();
        replyRef.current = { ...replyRef.current, reaction: { ...data.reaction } };
      }
    } catch (err) {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReply = async () => {
    try {
      await deleteReply({ postId, replyId: reply.id }).unwrap();
      dispatch({ type: ReplyActionTypes.DELETE, payload: true });
      toast({
        title: 'Reply deleted',
        description: 'Your reply has been deleted',
      });
    } catch (err) {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const onReplyEdit = (data: any) => {
    dispatch({ type: ReplyActionTypes.SUBMIT_EDIT, payload: data.content });
  };

  const onReplyEditCancel = () => {
    dispatch({ type: ReplyActionTypes.EDIT, payload: false });
  };

  if (state.isDeleted) {
    return null;
  }

  if (state.editState) {
    return <ReplyInput postId={postId} replyId={reply.id} replyInput={reply.content} onCancel={onReplyEditCancel} callback={onReplyEdit} />;
  }

  return (
    <div key={reply.id} className='group flex w-full space-x-6 '>
      <ProfilePicture url={reply.user.image} className='size-[40px]' />
      <div className='flex w-max max-w-[calc(100%-110px)] flex-col space-y-1'>
        <div className='relative flex space-x-3'>
          <div className='flex w-max min-w-[250px] flex-col rounded-xl bg-secondary p-2'>
            <h1 className='font-medium capitalize'>{`${reply.user.first_name} ${reply.user.last_name}`}</h1>
            <p className='break-all'>{state.replyContent}</p>
          </div>
          {isAuthor && (
            <ReplyOptions
              handleDelete={() => handleDeleteReply()}
              handleEdit={() => {
                dispatch({ type: ReplyActionTypes.EDIT, payload: true });
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
          <div
            onClick={handleReaction}
            className={cn('ml-4 font-medium hover:cursor-pointer hover:underline', state.isLiked && 'text-primary')}
          >
            Like
          </div>
          {state.reactions > 0 && (
            <div className='ml-auto flex items-center justify-end'>
              {state.reactions} <ThumbsUp size={20} className='ml-2 inline-flex' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
