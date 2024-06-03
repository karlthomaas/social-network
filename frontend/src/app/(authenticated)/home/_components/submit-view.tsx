import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/spinners';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { capitalize } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { changeText, increment } from '@/features/post/postSlice';

import React, { memo } from 'react';

export const SubmitView = memo(
  ({ isPending, showPrivacyOptions, onSubmit }: { isPending: boolean; showPrivacyOptions: boolean; onSubmit: () => void }) => {
    const dispatch = useAppDispatch();
    const postText = useAppSelector((state) => state.post.postText);
    const postPrivacyValue = useAppSelector((state) => state.post.privacy.value);

    const onChange = (obj: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(changeText(obj.target.value));
    };

    return (
      <DialogContent className='min-h-[325px]'>
        <DialogHeader className='text-left'>
          <DialogTitle className='text-lg'>Create Post</DialogTitle>
          {showPrivacyOptions && (
            <DialogDescription>
              <Button onClick={() => dispatch(increment())} className='mt-2' variant='outline' size='sm'>
                {capitalize(postPrivacyValue === 'almost_private' ? 'Almost private' : postPrivacyValue)}
              </Button>
            </DialogDescription>
          )}
        </DialogHeader>
        <Textarea value={postText} onChange={onChange} placeholder="What's on your mind?" />
        <Button onClick={onSubmit} disabled={isPending || !postText}>
          {isPending ? <LoadingSpinner /> : <>Submit</>}
        </Button>
      </DialogContent>
    );
  }
);

SubmitView.displayName = 'SubmitView';
