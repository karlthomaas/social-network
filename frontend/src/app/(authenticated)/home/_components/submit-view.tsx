import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { capitalize } from '@/lib/utils';
import React from 'react';
import { postStore } from './create-post';
import { LoadingSpinner } from '@/components/ui/spinners';

export const SubmitView = ({ isPending, onSubmit }: { isPending: boolean; onSubmit: () => void }) => {
  const next = postStore((state: any) => state.increment);
  const privacy = postStore((state: any) => state.privacy);
  const postText = postStore((state: any) => state.postText);

  const onChange = (obj: React.ChangeEvent<HTMLTextAreaElement>) => {
    postStore.setState({ postText: obj.target.value });
  };

  return (
    <DialogContent className='min-h-[325px]'>
      <DialogHeader className='text-left'>
        <DialogTitle className='text-lg'>Create Post</DialogTitle>
        <DialogDescription>
          <Button onClick={next} className='mt-2' variant='outline' size='sm'>
            {capitalize(privacy)}
          </Button>
        </DialogDescription>
      </DialogHeader>
      <Textarea value={postText} onChange={onChange} placeholder="What's on your mind?" />
      <Button onClick={onSubmit} disabled={isPending} >{isPending ? <LoadingSpinner /> : <>Submit</>}</Button>
    </DialogContent>
  );
};
