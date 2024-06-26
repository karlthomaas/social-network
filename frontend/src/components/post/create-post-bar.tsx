import type { PostType } from '@/components/post/post';
import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { CreatePost } from '@/app/(authenticated)/home/_components/create-post';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const CreatePostBar = ({
  image,
  callback,
  groupId,
}: {
  image?: string | null;
  callback: (response: PostType, action: 'update' | 'create') => void;
  groupId?: string;
}) => {
  return (
    <div className='flex h-[80px] w-full items-center rounded-xl border  bg-card px-6'>
      <ProfilePicture url={image} className='size-[45px] rounded-full' />
      <CreatePost callback={callback} groupId={groupId}>
        <DialogTrigger asChild>
          <Button className='ml-3 w-full justify-start text-muted-foreground hover:text-muted-foreground' variant='outline'>
            What's on your mind?
          </Button>
        </DialogTrigger>
      </CreatePost>
    </div>
  );
};
