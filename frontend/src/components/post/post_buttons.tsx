import { Button } from '../ui/button';
import { ThumbsUp, MessageSquare, Forward } from 'lucide-react';
import { useRef, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useCreatePostReactionMutation, useDeletePostReactionMutation } from '@/services/backend/actions/posts';

interface LikeButtonProps {
  postId: string;
  reactionId?: string;
  likeStatus: boolean;
  type: 'post' | 'reply';
  reactions: number;
}

export const LikeButton = ({ reactions, postId, reactionId, likeStatus }: LikeButtonProps) => {
  const [createReaction] = useCreatePostReactionMutation();
  const [deleteReaction] = useDeletePostReactionMutation();

  const [likes, setLikes] = useState(reactions);
  const [liked, setLiked] = useState(likeStatus);
  const reactionIdRef = useRef(reactionId);
  const { toast } = useToast();

  const handleReaction = async () => {
    try {
      let response;
      if (!reactionIdRef.current) {
        response = await createReaction({ postId }).unwrap();
        reactionIdRef.current = response.reaction.id;
        setLikes(likes + 1);
      } else {
        response = await deleteReaction({ postId, reactionId: reactionIdRef.current }).unwrap();
        reactionIdRef.current = '';
        setLikes(likes - 1);
      }
      setLiked((prev) => !prev);
    } catch (err) {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant='ghost' className='flex w-full items-center space-x-2' onClick={handleReaction}>
      <ThumbsUp className='inline-flex' fill={liked ? '#3b82f6' : ''} stroke={liked ? '#3b82f6#' : 'white'} />
      {likes ? <span>{likes}</span> : null}
    </Button>
  );
};

export const CommentButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick} variant='ghost' className='flex w-full items-center space-x-4'>
      <MessageSquare />
      <p>Comment</p>
    </Button>
  );
};

export const ShareButton = ({ link }: { link: string }) => {
  return (
    <Button variant='ghost' className='flex w-full items-center space-x-4'>
      <Forward />
      <p>Share</p>
    </Button>
  );
};
