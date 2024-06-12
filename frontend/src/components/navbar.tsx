'use client';

import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { NavbarProfile } from './buttons/navbar-profile';
import { LoginButton } from './buttons/login-btn';
import { FriendRequestsBtn } from './buttons/friend-requests-btn';
import { NotificationBtn } from './buttons/notifications-btn';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';

import { Sidebar } from '@/components/sidebar';
import { useGetSessionUserQuery } from '@/services/backend/actions/user';

export default function Navbar({ authenticate = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  useGetSessionUserQuery(null, { pollingInterval: 1000 * 50 * 5 });

  useEffect(() => {
    if (!user?.id) return;
    dispatch({ type: 'socket/connect' });
    return () => {
      dispatch({ type: 'socket/disconnect' });
    };
  }, [dispatch, user?.id]);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const navButtons = () => {
    if (isLoading) {
      return <div className='aspect-square w-[40px] animate-pulse rounded-full bg-secondary' />;
    } else if (user?.id) {
      return (
        <>
          <div className='hidden items-center space-x-5 lg:flex'>
            <NotificationBtn />
            {/* <FriendRequestsBtn userId={user.id} /> */}
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
  }
  
  return (
    <>
      <nav className='h-[65px] w-full border-b-[1px] border-border'>
        <ul className='mx-auto flex h-full max-w-screen-md items-center justify-between p-4'>
          <li>
            <Link href='/home' className='flex itemscenter space-x-4'>
              <div className='h-[30px] w-[30px] rounded-lg bg-secondary' />
              <p className='text-lg'>Social Network</p>
            </Link>
          </li>
          {navButtons()}
        </ul>
      </nav>
      <Sidebar handleClose={handleCloseSidebar} isOpen={sidebarOpen}>
        Bruh
      </Sidebar>
    </>
  );
}
