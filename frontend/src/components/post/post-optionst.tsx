import type { PostType } from './post';

import { Button } from '../ui/button';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { fetcherWithOptions } from '@/lib/fetchers';

export const PostOptions = ({ post }: { post: PostType }) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className='' variant='ghost' size='icon'>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Pencil size={17} className='mr-2' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className='text-red-700 focus:text-red-600 hover:cursor-pointer' onClick={() => deleteMutation.mutate()}>
          <Trash2 size={17} className='mr-2' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
