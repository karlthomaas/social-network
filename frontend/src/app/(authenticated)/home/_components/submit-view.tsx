import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { capitalize } from '@/lib/utils';
import React from 'react';
import { postStore } from './create-post';
import { LoadingSpinner } from '@/components/ui/spinners';
import { PostType } from '@/components/post/post';
import { Input } from '@/components/ui/input';

export const SubmitView = ({
  isPending,
  showPrivacyOptions,
  onSubmit,
}: {
  isPending: boolean;
  showPrivacyOptions: boolean;
  onSubmit: () => void;
}) => {
  const next = postStore((state: any) => state.increment);
  const privacy = postStore((state: any) => state.privacy);
  const postText = postStore((state: any) => state.postText);

  const onChange = (obj: React.ChangeEvent<HTMLTextAreaElement>) => {
    postStore.setState({ postText: obj.target.value });
  };

  const onFileChange = (obj: React.ChangeEvent<HTMLInputElement>) => {
    if (!obj.target.files) return;
    postStore.setState({ postFile: obj.target.files[0] });
  };

  return (
    <DialogContent className='min-h-[325px]'>
      <DialogHeader className='text-left'>
        <DialogTitle className='text-lg'>Create Post</DialogTitle>
        {showPrivacyOptions && (
          <DialogDescription>
            <Button onClick={next} className='mt-2' variant='outline' size='sm'>
              {capitalize(privacy === 'almost_private' ? 'Almost private' : privacy)}
            </Button>
          </DialogDescription>
        )}
      </DialogHeader>
      <Textarea value={postText} onChange={onChange} placeholder="What's on your mind?" />
      <Input onChange={onFileChange} type='file' placeholder='select file' />
      <Button onClick={onSubmit} disabled={isPending}>
        {isPending ? <LoadingSpinner /> : <>Submit</>}
      </Button>
    </DialogContent>
  );
};
