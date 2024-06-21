import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/spinners';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { capitalize } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { changeText, increment } from '@/features/post/postSlice';

import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';
import { ImageIcon, X } from 'lucide-react';

export const SubmitView = memo(
  ({
    isPending,
    showPrivacyOptions,
    onSubmit,
  }: {
    isPending: boolean;
    showPrivacyOptions: boolean;
    onSubmit: (file: File | null) => void;
  }) => {
    const dispatch = useAppDispatch();
    const postText = useAppSelector((state) => state.post.postText);
    const postPrivacyValue = useAppSelector((state) => state.post.privacy.value);
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [addImage, setAddImage] = useState(false);

    const onChange = (obj: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(changeText(obj.target.value));
    };

    const handleFileChange = useCallback((files: File[]) => {
      if (files.length > 0) {
        setFile(files[0]);
        setImageUrl(URL.createObjectURL(files[0]));
      } else {
        setFile(null);
        setImageUrl('');
        setAddImage(false);
      }
    }, []);

    return (
      <DialogContent className='min-h-[325px] bg-card'>
        <DialogHeader className='text-left'>
          <DialogTitle className='text-lg'>Create Post</DialogTitle>
          {showPrivacyOptions && (
            <DialogDescription>
              <Button onClick={() => dispatch(increment())} className='mt-2 ' variant='outline' size='sm'>
                {capitalize(postPrivacyValue === 'almost_private' ? 'Almost private' : postPrivacyValue)}
              </Button>
            </DialogDescription>
          )}
        </DialogHeader>
        <Textarea value={postText} onChange={onChange} placeholder="What's on your mind?" />
        {imageUrl && (
          <div className='group relative flex h-[225px] w-full items-center justify-center rounded-xl border '>
            <Button
              size='icon'
              className='absolute -right-2 -top-2 bg-border  text-white hover:brightness-110 group-hover:flex'
              onClick={() => handleFileChange([])}
            >
              <X />
            </Button>
            {imageUrl && <Image src={imageUrl} alt='image' width={200} height={200} />}
          </div>
        )}
        {addImage && !imageUrl && <FileUpload callback={handleFileChange} />}
        {!addImage && (
          <div className='flex h-[50px] w-full items-center  justify-between rounded-xl border px-5 text-muted-foreground'>
            <h3>Add to your post</h3>
            <div>
              <Button size='icon' variant='ghost' onClick={() => setAddImage(true)}>
                <ImageIcon />
              </Button>
            </div>
          </div>
        )}

        <Button onClick={() => onSubmit(file)} disabled={isPending || !postText}>
          {isPending ? <LoadingSpinner /> : <>Submit</>}
        </Button>
      </DialogContent>
    );
  }
);

SubmitView.displayName = 'SubmitView';
