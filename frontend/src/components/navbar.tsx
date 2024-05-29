'use client';

import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { NavbarProfile } from './buttons/navbar-profile';
import { useSession } from '@/providers/user-provider';
import { useMemo } from 'react';
import { LoginButton } from './buttons/login-btn';
import { FriendRequestsBtn } from './buttons/friend-requests-btn';
import { NotificationBtn } from './buttons/notifications-btn';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect, useState } from 'react';

import { Sidebar } from '@/components/sidebar';

export default function Navbar({ authenticate = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!authenticate) return;

    // initialize socket connection
    dispatch({ type: 'socket/connect' });

    return () => {
      dispatch({ type: 'socket/disconnect' });
    };
  }, [dispatch, authenticate]);

  const { user, isLoading } = useSession();

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const navbarButtons = useMemo(() => {
    if (!authenticate) {
      return <LoginButton />;
    } else if (isLoading) {
      return <div className='aspect-square w-[40px] animate-pulse rounded-full bg-secondary' />;
    } else if (user) {
      return (
        <>
          <div className='hidden items-center space-x-5 lg:flex'>
            <NotificationBtn />
            <FriendRequestsBtn userId={user.id} />
            <NavbarProfile />
          </div>
          <Button size='sm' variant='ghost' className='lg:hidden' onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={25} />
          </Button>
        </>
      );
    } else {
      return <LoginButton />;
    }
  }, [authenticate, isLoading, user, sidebarOpen]);

  return (
    <>
      <nav className='h-[65px] w-full border-b-[1px] border-border'>
        <ul className='mx-auto flex h-full max-w-screen-md items-center justify-between p-4'>
          <li>
            <Link href='/' className='flex items-center space-x-4'>
              <div className='h-[30px] w-[30px] rounded-lg bg-secondary' />
              <p className='text-lg'>Social Network</p>
            </Link>
          </li>
          {navbarButtons}
        </ul>
      </nav>
      <Sidebar handleClose={handleCloseSidebar} isOpen={sidebarOpen}>
        Bruh
      </Sidebar>
    </>
  );
}
