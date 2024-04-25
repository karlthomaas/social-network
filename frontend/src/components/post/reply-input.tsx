import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetcherWithOptions } from '@/lib/fetchers';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import type { ReplyType } from './replies';
import { Image } from 'lucide-react';
import { useRef } from 'react';
import { toast } from '../ui/use-toast';

export const ReplyInput = ({
  postId,
  replyId,
  replyInput = '',
  setNewReply,
  callback = () => {},
  onCancel = () => {},
}: {
  postId: string;
  replyId?: string;
  replyInput?: string;
  onCancel?: () => void;
  setNewReply?: (reply: ReplyType) => void;
  callback?: (data: any) => void;
}) => {
  const [input, setInput] = useState(replyInput);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // focus on textarea when rendered
    textareaRef.current?.focus();
  }, []);

  // using this for invalidating the post query
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['reply'],
    mutationFn: async ({ content }: { content: string }) => {
      const method = replyId ? 'PATCH' : 'POST';
      const url = replyId ? `/api/posts/${postId}/reply/${replyId}` : `/api/posts/${postId}/reply`;
      return fetcherWithOptions({ url, method, body: { content } });
    },
    onError: () => {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
    onSuccess: (data: any) => {
      if (!replyInput && setNewReply) {
        setInput('');
        setNewReply(data.reply);
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
      }
      callback(data.reply);
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!input) return;
    mutation.mutate({ content: input });
  };

  return (
    <form onSubmit={onSubmit} className='mb-3 flex h-max w-full space-x-5'>
      <div className='aspect-square h-[40px] rounded-full bg-secondary' />
      <div className='flex w-full flex-col space-y-2'>
        <Textarea ref={textareaRef} onChange={(e) => setInput(e.target.value)} value={input} placeholder='Comment as John Doe' />
        <div className='flex'>
          <Button type='button' size='icon' variant='ghost'>
            <Image />
          </Button>
          <div className='ml-auto flex space-x-2'>
            {replyId && (
              <Button type='button' size='sm' variant='secondary' className='w-[120px]' onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type='submit' size='sm' className='w-[120px]' disabled={mutation.isPending || !input}>
              {replyId ? 'Edit' : 'Reply'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
