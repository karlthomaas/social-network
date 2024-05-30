'use client';

import React, { memo, useCallback, useEffect } from 'react';

import { Dialog } from '@/components/ui/dialog';

import { SubmitView } from './submit-view';
import { PrivacyView } from './privacy-view';
import { AlmostPrivateView } from './almost-private';
import { PostType } from '@/components/post/post';
import { useState } from 'react';

import { GroupType } from '../../groups/page';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { changeText, reset, setPrivacy } from '@/features/post/postSlice';

import { useCreatePostMutation, useUpdatePostMutation, useCreateGroupPostMutation } from '@/services/backend/backendApi';
import { toast } from '@/components/ui/use-toast';

export const CreatePost = memo(
  ({
    children,
    post,
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

    const dispatch = useAppDispatch();
    const [createPost] = useCreatePostMutation();
    const [updatePost] = useUpdatePostMutation();
    const [createGroupPost] = useCreateGroupPostMutation();
    const postSelector = useAppSelector((state) => state.post);
    const userSelector = useAppSelector((state) => state.auth.user);

    useEffect(() => {
      if (post && open) {
        dispatch(changeText(post.content));
        dispatch(setPrivacy(post.privacy));
      }
    }, [post, open, dispatch]);

    const handleSubmit = useCallback(async () => {
      const body = {
        content: postSelector.postText,
        privacy: postSelector.privacy.value === 'almost private' ? 'almost_private' : postSelector.privacy.value,
        visible_to: postSelector.privacy.visibleTo,
      };

      let newPost: PostType;
      try {
        if (group) {
          const response = await createGroupPost({ groupId: group.id, ...body }).unwrap();
          newPost = { ...response.post };
        } else if (post) {
          const response = await updatePost({ id: post.id, ...body }).unwrap();
          newPost = { ...response.post };
        } else {
          const response = await createPost(body).unwrap();
          newPost = { ...response.post };
        }

        // add user field because backend doesn't
        if (userSelector) {
          newPost.user = userSelector;
        }

        callback(newPost, post ? 'update' : 'create');
        setOpen(false);

        toast({
          title: post ? 'Post updated' : 'Post created',
          description: post ? 'Your post has been updated' : 'Your post has been created',
        });
      } catch (err) {
        toast({
          title: 'Something went wrong...',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    }, [
      createGroupPost,
      createPost,
      group,
      post,
      postSelector.postText,
      postSelector.privacy.value,
      postSelector.privacy.visibleTo,
      userSelector,
      updatePost,
      callback,
    ]);

    const resetStores = () => {
      dispatch(reset());
    };

    const handleModalState = (state: boolean) => {
      if (post) {
        dispatch(changeText(post.content));
        dispatch(setPrivacy(post.privacy));
      }

      if (!state) {
        resetStores();
      }
      setOpen(state);
    };

    let views = [<SubmitView key={1} onSubmit={handleSubmit} isPending={false} showPrivacyOptions={!group} />];

    if (!group) {
      views = [...views, <PrivacyView key={2} />, <AlmostPrivateView key={3} />];
    }

    return (
      <>
        <Dialog open={open} onOpenChange={handleModalState}>
          {children}
          {open && views[postSelector.view]}
        </Dialog>
      </>
    );
  }
);

CreatePost.displayName = 'CreatePost';
