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
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '@/services/backend/backendApi';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';

export const NavbarProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const toastId = 'logout-toast';

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch({ type: 'socket/disconnect' });
      dispatch({ type: 'auth/logout' });
      router.push('/login');
    } catch (error) {
      toast({
        itemID: toastId,
        title: 'Something went wrong',
      });
    }
  };

  if (!user) {
    return null;
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
        <DropdownMenuItem className='hover:cursor-pointer' onClick={() => handleLogout()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
