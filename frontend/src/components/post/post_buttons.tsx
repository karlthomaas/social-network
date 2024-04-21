import { Button } from '../ui/button';
import { ThumbsUp, MessageSquare, Forward } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { useRef, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { create } from 'zustand';

interface LikeButtonProps {
  postId: string;
  reactionId?: string;
  likeStatus: boolean;
  type: 'post' | 'reply';
  reactions: number;
}

export const LikeButton = ({ reactions, postId, reactionId, likeStatus}: LikeButtonProps) => {
  const [likes , setLikes] = useState(reactions);
  const [liked, setLiked] = useState(likeStatus);
  const reactionIdRef = useRef(reactionId);
  const { toast } = useToast();


  const mutation = useMutation({
    mutationFn: async () => {
      const url = !reactionIdRef.current ? `/api/posts/${postId}/reactions` : `/api/posts/${postId}/reactions/${reactionIdRef.current}`;
      const method = !reactionIdRef.current ? 'POST' : 'DELETE';
      return fetcherWithOptions({
        url,
        method,
        body: {},
      });
    },
    onError: (error) => {
      console.log(error)
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
    onSuccess: (data: any) => {
      reactionIdRef.current = data?.reaction?.id || '';

      if (reactionIdRef.current) {
        setLikes(likes + 1);
      } else {
        setLikes(likes - 1)
      }
      setLiked((prev) => !prev);
    },
  });

  return (
    <Button variant='ghost' className='flex w-full items-center space-x-4' onClick={() => mutation.mutate()}>
      <ThumbsUp fill={liked ? '#3b82f6' : ''} stroke={liked ? '#3b82f6#' : 'white'} />
      { likes }
    </Button>
  );
};

export const CommentButton = () => {
  return (
    <Button variant='ghost' className='flex w-full items-center space-x-4'>
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
