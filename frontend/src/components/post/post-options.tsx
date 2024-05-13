import type { PostType } from './post';

import { Button } from '../ui/button';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { fetcherWithOptions } from '@/lib/fetchers';
import { CreatePost } from '@/app/(authenticated)/home/_components/create-post';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useState } from 'react';

export const PostOptions = ({ post }: { post: PostType }) => {
  const [postHolder, PostHolder] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return fetcherWithOptions({
        url: `/api/posts/${post.id}`,
        method: 'DELETE',
        body: {},
      });
    },
    onSuccess: () => {
      // Refresh the posts feed
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: 'Post deleted',
        description: 'Your post has been deleted',
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong...',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  return (
    <CreatePost post={post}>
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
          <DropdownMenuItem className='text-red-700 hover:cursor-pointer focus:text-red-600' onClick={() => deleteMutation.mutate()}>
            <Trash2 size={17} className='mr-2' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CreatePost>
  );
};
