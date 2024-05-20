'use client';

import { create } from 'zustand';
import React, { useEffect } from 'react';

import { Dialog } from '@/components/ui/dialog';

import { SubmitView } from './submit-view';
import { PrivacyView } from './privacy-view';
import { AlmostPrivateView } from './almost-private';
import { PostType } from '@/components/post/post';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { privacyStore } from './privacy-view';

import { useMutation } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { GroupType } from '../../groups/page';
import { on } from 'events';
import axios from 'axios';

export const postStore = create((set) => ({
  view: 0,
  postText: '',
  postFile: undefined,
  privacy: 'public',
  visibleTo: [],
  reset: () => set({ privacy: 'public', view: 0, postText: '' }),
  increment: () => set((state: any) => ({ view: state.view + 1 })),
  deincrement: () => set((state: any) => ({ view: state.view - 1 })),
}));

export const CreatePost = ({
  children,
  post,
  mutationKeys = ['posts'],
  group,
  callback,
}: {
  children: React.ReactNode;
  post?: PostType;
  mutationKeys?: string[];
  group?: GroupType;
  callback: (response: PostType, action: 'update' | 'create') => void;
}) => {
  const [open, setOpen] = useState(false);
  const view = postStore((state: any) => state.view);
  const reset = postStore((state: any) => state.reset);
  const privacy = postStore((state: any) => state.privacy);
  const postFile = postStore((state: any) => state.postFile);
  const postText = postStore((state: any) => state.postText);
  const visibleTo = postStore((state: any) => state.visibleTo);

  useEffect(() => {
    if (post && open) {
      postStore.setState({ postText: post.content });
      postStore.setState({ privacy: post.privacy });
    }
  }, []);

  const mutation = useMutation({
    mutationKey: mutationKeys,
    mutationFn: () => {
      let url;
      if (group && post) {
        url = `/api/groups/${group.id}/posts/${post.id}`;
      } else if (group && !post) {
        url = `/api/groups/${group.id}/posts`;
      } else if (!group && post) {
        url = `/api/posts/${post.id}`;
      } else {
        url = '/api/posts';
      }

      return fetcherWithOptions({
        url,
        method: post ? 'PATCH' : 'POST',
        body: {
          content: postText,
          privacy: privacy === 'almost private' ? 'almost_private' : privacy,
          visible_to: visibleTo,
        },
      });
    },
    onSuccess: (data) => {
      setOpen(false);
      resetStores();
      if (postFile) {
        fileMutation.mutate({ postId: data.post.id, file: postFile });
      }

      if (post) {
        toast({
          title: 'Post updated',
          description: 'Your post has been updated',
        });
        callback(data.post, 'update');
      } else {
        toast({
          title: 'Post created',
          description: 'Your post has been created',
        });
        callback(data.post, 'create');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const fileMutation = useMutation({
    mutationFn: async ({ postId, file }: { postId: string; file: File }) => {
      const formData = new FormData();
      formData.append('images', file);

      return axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/post/${postId}`, formData, {
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
  const resetStores = () => {
    privacyStore.setState({ radioValue: 'public', visibleTo: [] });
    reset();
  };

  let views = [<SubmitView onSubmit={() => mutation.mutate()} isPending={mutation.isPending} showPrivacyOptions={!group} />];

  if (!group) {
    views = [...views, <PrivacyView />, <AlmostPrivateView />];
  }

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
