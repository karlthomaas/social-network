'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcherWithOptions } from '@/lib/fetchers';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/user-provider';

export const NavbarProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  
  const toastId = 'logout-toast';
  
  const mutation = useMutation({
    mutationKey: ['session'],
    mutationFn: async () => {
      return fetcherWithOptions({ url: '/api/logout', method: 'POST', body: {} });
    },
    onMutate: () => {
      toast({
        itemID: toastId,
        title: 'Logging out...',
        description: 'Please wait',
      });
    },
    onSuccess: () => {
      toast({
        itemID: toastId,
        title: 'Logged out',
      });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      router.push('/login');
    },
    onError: () => {
      toast({
        itemID: toastId,
        title: 'Something went wrong',
      });
    },
  });

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='aspect-square h-[40px] rounded-full bg-secondary' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/profile/${user.nickname}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href='/groups'>Groups</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem  className="hover:cursor-pointer" onClick={() => mutation.mutate()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
