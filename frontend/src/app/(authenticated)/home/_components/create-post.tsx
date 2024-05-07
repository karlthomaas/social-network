'use client';

import { create } from 'zustand';
import React, { useEffect } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { SubmitView } from './submit-view';
import { PrivacyView } from './privacy-view';
import { AlmostPrivateView } from './almost-private';
import { PostType } from '@/components/post/post';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { privacyStore } from './privacy-view';

import { useQueryClient, useMutation } from '@tanstack/react-query';
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

export const CreatePost = ({ children, post }: { children: React.ReactNode; post?: PostType }) => {
  const [open, setOpen] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setOpen(false);
      resetStores();
      if (post) {
        toast({
          title: 'Post updated',
          description: 'Your post has been updated',
        });
      } else {
        toast({
          title: 'Post created',
          description: 'Your post has been created',
        });
      }
    },
    onError: () => {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const resetStores = () => {
    privacyStore.setState({ radioValue: 'public', visibleTo: [] });
    reset();
  };

  const views = [
    <SubmitView onSubmit={() => mutation.mutate()} isPending={mutation.isPending} post={post} />,
    <PrivacyView />,
    <AlmostPrivateView />,
  ];

  const handleModalState = (state: boolean) => {
    if (post) {
      postStore.setState({ postText: post.content });
      postStore.setState({ privacy: post.privacy });
    }

    if (!state) {
      resetStores();
    }

    setOpen(state);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleModalState}>
        {children}
        {views[view]}
      </Dialog>
    </>
  );
};
