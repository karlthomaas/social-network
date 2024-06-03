import type { PostType } from './post';

import { Button } from '../ui/button';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '../ui/use-toast';
import { fetcherWithOptions } from '@/lib/fetchers';
import { CreatePost } from '@/app/(authenticated)/home/_components/create-post';
import { DialogTrigger } from '../ui/dialog';
import { useDeletePostMutation } from '@/services/backend/actions/posts';

export const PostOptions = ({ post, setPost }: { post: PostType, setPost: (post: PostType | undefined) => void }) => {
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async () => {
    try {
      await deletePost(post.id).unwrap();
      toast({
        title: 'Post deleted',
        description: 'Your post has been deleted',
      });
      setPost(undefined);
    } catch (err) {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <CreatePost post={post} callback={setPost}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem className='hover:cursor-pointer'>
              <Pencil size={17} className='mr-2' /> Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem className='text-red-700 hover:cursor-pointer focus:text-red-600' onClick={handleDelete}>
            <Trash2 size={17} className='mr-2' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CreatePost>
  );
};
