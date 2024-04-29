'use client';

import { create } from 'zustand';
import React from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { SubmitView } from './submit-view';
import { PrivacyView } from './privacy-view';
import { AlmostPrivateView } from './almost-private';
import { privacyStore } from './privacy-view';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';

export const postStore = create((set) => ({
  view: 0,
  postText: '',
  privacy: 'public',
  visibleTo: [],
  reset: () => set({ privacy: 'public', view: 0, postText: '' }),
  increment: () => set((state: any) => ({ view: state.view + 1 })),
  deincrement: () => set((state: any) => ({ view: state.view - 1 })),
}));

export const CreatePost = () => {
  const queryClient = useQueryClient();
  const view = postStore((state: any) => state.view);
  const reset = postStore((state: any) => state.reset);
  const privacy = postStore((state: any) => state.privacy);
  const postText = postStore((state: any) => state.postText);
  const visibleTo = postStore((state: any) => state.visibleTo);

  const mutation = useMutation({
    mutationKey: ['posts'],
    mutationFn: () =>
      fetcherWithOptions({
        url: '/api/posts',
        method: 'POST',
        body: {
          content: postText,
          privacy: privacy === 'almost private' ? 'almost_private' : privacy,
          image: null,
          visible_to: visibleTo,
        },
      }),
      onSuccess: () => {
        // Refresh the posts feed
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
  });

  const onSubmit = () => {
    mutation.mutate();
  };
  const views = [<SubmitView onSubmit={onSubmit} isPending={mutation.isPending} />, <PrivacyView />, <AlmostPrivateView />];

  const handleModalState = (state: boolean) => {
    if (state === true) return;
    privacyStore.setState({ radioValue: 'public' });
    reset();
  };

  return (
    <>
      <Dialog  onOpenChange={handleModalState}>
        <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
          <div className='aspect-square w-[50px] rounded-full bg-secondary' />
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </div>
        {views[view]}
      </Dialog>
    </>
  );
};
