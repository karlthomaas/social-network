import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { capitalize } from '@/lib/utils';
import React from 'react';
import { postStore } from './create-post';

export const SubmitView = ({}: {}) => {
  const next = postStore((state: any) => state.increment);
  const privacy = postStore((state: any) => state.privacy);
  const postText = postStore((state: any) => state.postText);

  const onChange = (obj: React.ChangeEvent<HTMLTextAreaElement>) => {
    postStore.setState({ postText: obj.target.value });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Post</DialogTitle>
        <DialogDescription>
          <Button onClick={next} variant='outline' size='sm'>
            {capitalize(privacy)}
          </Button>
        </DialogDescription>
      </DialogHeader>
      <Textarea value={postText} onChange={onChange} placeholder="What's on your mind?" />
      <Button>Submit</Button>
    </DialogContent>
  );
};
