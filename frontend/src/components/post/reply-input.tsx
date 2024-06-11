'use client';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import type { ReplyType } from './replies';
import { useRef } from 'react';
import { toast } from '../ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePostReplyMutation, useUpdatePostReplyMutation } from '@/services/backend/actions/replies';

const formSchema = z.object({
  postId: z.string().optional(),
  replyId: z.string().optional(),
  content: z.string().min(1),
  // file: z.instanceof(File).optional(),
});

export type ReplyFormProps = z.infer<typeof formSchema>;

export const ReplyInput = ({
  postId,
  replyId,
  replyInput = '',
  setNewReply = () => {},
  onCancel = () => {},
  callback = () => {},
}: {
  postId: string;
  replyId?: string;
  replyInput?: string;
  onCancel?: () => void;
  setNewReply?: (reply: ReplyType) => void;
  callback?: (data: any) => void;
}) => {
  const [createReply, { isLoading: isLoadingCreate }] = useCreatePostReplyMutation();
  const [editReply, { isLoading: isLoadingEdit }] = useUpdatePostReplyMutation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm<ReplyFormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: replyInput,
      postId,
      replyId,
    },
  });

  const input = form.watch('content');
  // const fileRef = form.register('file');

  const onSubmit = async (data: ReplyFormProps) => {
    try {
      let response;
      if (replyId) {
        response = await editReply(data).unwrap();
      } else {
        response = await createReply(data).unwrap();
      }
      callback(response.reply);
      setNewReply(response.reply);
      form.reset();
      form.setValue('content', '');
    } catch (err) {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };


  useEffect(() => {
    // focus on textarea when rendered
    textareaRef.current?.focus();
  }, []);
  // const fileRef = form.register('file');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType='multipart/form-data' className='mb-3 flex h-max w-full space-x-5'>
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
            {/* <Input type='file' {...fileRef} onChange={(event) => setFile(event?.target?.files?.[0])} /> */}
            <div className='ml-auto flex space-x-2'>
              {replyId && (
                <Button type='button' size='sm' variant='secondary' className='w-[120px]' onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type='submit'
                size='sm'
                className='w-[120px]'
                disabled={isLoadingCreate || isLoadingEdit || !input}
              >
                {replyId ? 'Edit' : 'Reply'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
