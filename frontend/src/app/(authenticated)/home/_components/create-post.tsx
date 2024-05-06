'use client';

import { create } from 'zustand';
import React, { useEffect } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { Dialog } from '@/components/ui/dialog';

import { SubmitView } from './submit-view';
import { PrivacyView } from './privacy-view';
import { privacyStore } from './privacy-view';
import { AlmostPrivateView } from './almost-private';
import { PostType } from '@/components/post/post';

export const postStore = create((set) => ({
  view: 0,
  postText: '',
  privacy: 'public',
  visibleTo: [],
  reset: () => set({ privacy: 'public', view: 0, postText: '' }),
  increment: () => set((state: any) => ({ view: state.view + 1 })),
  deincrement: () => set((state: any) => ({ view: state.view - 1 })),
}));

export const CreatePost = ({ children, post }: { children: React.ReactNode; post?: PostType }) => {
  const queryClient = useQueryClient();
  const view = postStore((state: any) => state.view);
  const reset = postStore((state: any) => state.reset);
  const privacy = postStore((state: any) => state.privacy);
  const postText = postStore((state: any) => state.postText);
  const visibleTo = postStore((state: any) => state.visibleTo);

  useEffect(() => {
    if (post) {
      console.log(post);
      postStore.setState({ postText: post.content });
      postStore.setState({ privacy: post.privacy });
    }
  }, []);

  const mutation = useMutation({
    mutationKey: ['posts'],
    mutationFn: () =>
      fetcherWithOptions({
        url: post ? `/api/posts/${post.id}` : '/api/posts',
        method: post ? 'PATCH' : 'POST',
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
  const views = [<SubmitView onSubmit={onSubmit} isPending={mutation.isPending} post={post} />, <PrivacyView />, <AlmostPrivateView />];

  const handleModalState = (state: boolean) => {
    if (state === true) return;
    privacyStore.setState({ radioValue: 'public' });
    reset();
  };

  return (
    <>
      <Dialog onOpenChange={handleModalState}>
        {children}
        {views[view]}
      </Dialog>
    </>
  );
};
