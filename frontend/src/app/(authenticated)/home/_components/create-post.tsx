import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogContent } from './dialog-content';
import React from 'react';

export const CreatePost = () => {
  return (
    <>
      <Dialog>
        <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-3'>
          <div className='aspect-square w-[50px] rounded-full bg-secondary' />
          <DialogTrigger asChild>
            <Button className='ml-3 w-full justify-start' variant='outline'>
              What's on your mind?
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent />
      </Dialog>
    </>
  );
};
