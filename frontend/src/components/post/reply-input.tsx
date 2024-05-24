"use client";

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetcherWithOptions } from '@/lib/fetchers';
import { Textarea } from '../ui/textarea';
import type { ReplyType } from './replies';
import { useRef } from 'react';
import { toast } from '../ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ReplyInput = ({
  postId,
  replyId,
  replyInput = '',
  setNewReply,
  callback = () => { },
  onCancel = () => { },
}: {
  postId: string;
  replyId?: string;
  replyInput?: string;
  onCancel?: () => void;
  setNewReply?: (reply: ReplyType) => void;
  callback?: (data: any) => void;
}) => {
  const formSchema = z.object({
    content: z.string().min(1),
    // file: z.instanceof(File).optional(),
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: replyInput,
    },
  });

  useEffect(() => {
    // focus on textarea when rendered
    textareaRef.current?.focus();
  }, []);

  // using this for invalidating the post query
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['reply'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const method = replyId ? 'PATCH' : 'POST';
      const url = replyId ? `/api/posts/${postId}/reply/${replyId}` : `/api/posts/${postId}/reply`;
      return fetcherWithOptions({ url, method, body: values });
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
        setNewReply(data.reply);
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
      }
      callback(data.reply);
      form.reset();
      form.setValue('content', '');
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  const input = form.watch('content');
  // const fileRef = form.register('file');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className='mb-3 flex h-max w-full space-x-5'>
        <div className='aspect-square h-[40px] rounded-full bg-secondary' />
        <div className='flex w-full flex-col space-y-2'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder='Comment as John Doe' {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div className='flex'>
            {/* <FormField
              control={form.control}
              name='file'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input type='file' placeholder='shadcn' accept="image/webp, image/jpeg, image/png" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            /> */}
            <div className='ml-auto flex space-x-2'>
              {replyId && (
                <Button type='button' size='sm' variant='secondary' className='w-[120px]' onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button onClick={form.handleSubmit(onSubmit)} type='submit' size='sm' className='w-[120px]' disabled={mutation.isPending || !input}>
                {replyId ? 'Edit' : 'Reply'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
