import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { fetcherWithOptions } from '@/lib/fetchers';
import { Textarea } from '../ui/textarea';

export const Reply = ({ post_id }: { post_id: string }) => {
  const [input, setInput] = useState('');

  const mutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      return fetcherWithOptions({ url: `/api/posts/${post_id}/reply`, method: 'POST', body: { content } });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data: any) => {
      console.log(data);
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate({ content: input });
  };

  return (
    <form onSubmit={onSubmit} className='mb-3 flex h-max w-full space-x-5'>
      <div className='aspect-square h-[40px] rounded-full bg-secondary' />
      <Textarea onChange={(e) => setInput(e.target.value)} value={input} placeholder='Comment as John Doe' />
    </form>
  );
};
