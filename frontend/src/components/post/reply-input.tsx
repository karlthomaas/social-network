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
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { useAppSelector } from '@/lib/hooks';
import { Input } from '@/components/ui/input';
import { ImageUploadCompact } from '@/components/image-upload-compact';
import { useUploadImageMutation } from '@/services/backend/actions/posts';

const formSchema = z.object({
  postId: z.string().optional(),
  replyId: z.string().optional(),
  content: z.string().min(1),
  images: z.unknown().transform((value) => {
    return value as FileList;
  }),
});

export type ReplyFormProps = z.infer<typeof formSchema>;

export const ReplyInput = ({
  postId,
  replyId,
  replyInput = '',
  onCancel = () => {},
  callback = () => {},
}: {
  postId: string;
  replyId?: string;
  replyInput?: string;
  onCancel?: () => void;
  callback?: (reply: ReplyType, type: 'create' | 'edit') => void;
}) => {
  const [createReply, { isLoading: isLoadingCreate }] = useCreatePostReplyMutation();
  const [editReply, { isLoading: isLoadingEdit }] = useUpdatePostReplyMutation();
  const [uploadImage] = useUploadImageMutation();

  const { user } = useAppSelector((state) => state.auth);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm<ReplyFormProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: replyInput,
      postId,
      replyId,
    },
  });

  const imageRef = form.register('images');
  const input = form.watch('content');

  const createImageForm = (file: File) => {
    const formData = new FormData();
    formData.append('images', file as File);
    return formData;
  };

  const onSubmit = async (data: ReplyFormProps) => {
    try {
      const { images, ...values } = data;
      let reply: ReplyType;
      let type: 'create' | 'edit';

      if (replyId) {
        const response = await editReply(values).unwrap();
        reply = { ...response.reply };
        type = 'edit';
      } else {
        const response = await createReply(values).unwrap();
        reply = { ...response.reply };
        type = 'create';
      }

      if (images.length > 0) {
        const data = createImageForm(images[0]);
        try {
          const { images } = await uploadImage({ option: 'replies', id: reply.id, data }).unwrap();
          reply.image = images[0].split(',')[0];
        } catch (err) {
          toast({
            title: 'Error uploading image...',
            description: 'Please try again later',
            variant: 'destructive',
          });
        }
      }

      callback(reply, type);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} encType='multipart/form-data' className='mb-3 flex h-max w-full space-x-5'>
        <ProfilePicture className='size-[40px] rounded-full bg-secondary' url={user?.image} />
        <div className='flex w-full flex-col space-y-2'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder={`Comment as ${user?.first_name} ${user?.last_name}`} {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div className='flex'>
            <FormField
              control={form.control}
              name='images'
              render={() => {
                return (
                  <FormItem>
                    <FormControl>
                      <ImageUploadCompact formRef={imageRef} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
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
