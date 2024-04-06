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

export const NavbarProfile = ({ profile }: { profile: string }) => {
  const toastId = 'logout-toast';
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='aspect-square h-[40px] rounded-full bg-secondary' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/${profile}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutation.mutate()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
