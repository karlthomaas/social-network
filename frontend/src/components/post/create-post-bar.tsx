import type { PostType } from '@/components/post/post';
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { CreatePost } from '@/app/(authenticated)/home/_components/create-post';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const CreatePostBar = ({
  image,
  callback,
}: {
  image?: string | null;
  callback: (response: PostType, action: 'update' | 'create') => void;
}) => {
  return (
    <div className='flex h-[80px] w-full items-center rounded-xl border border-border bg-background px-6'>
      <ProfilePicture url={image} className='size-[45px] rounded-full' />
      <CreatePost callback={callback}>
        <DialogTrigger asChild>
          <Button className='ml-3 w-full justify-start' variant='outline'>
            What's on your mind?
          </Button>
        </DialogTrigger>
      </CreatePost>
    </div>
  );
};
