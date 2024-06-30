'use client';

import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { NavbarProfile } from './buttons/navbar-profile';
import { LoginButton } from './buttons/login-btn';
import { NotificationBtn } from './buttons/notifications-btn';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';

import { Sidebar } from '@/components/sidebar';
import { useGetSessionUserQuery } from '@/services/backend/actions/user';
import { ModeToggle } from '@/components/buttons/theme-button';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  };

  return (
    <>
      <nav className='h-[65px] w-full border-b-[1px] bg-card '>
        <ul className='mx-auto flex h-full max-w-screen-md items-center justify-between p-4 lg:max-w-screen-2xl'>
          <li>
            <Link href='/home' className='flex items-center space-x-4'>
              <div className='h-[30px] w-[30px] rounded-lg bg-secondary' />
              <p className='text-lg'>Social Network</p>
            </Link>
          </li>
          <div className='flex space-x-2 lg:space-x-5'>
            <ModeToggle />
            {navButtons()}
          </div>
        </ul>
      </nav>
      <Sidebar handleClose={handleCloseSidebar} isOpen={sidebarOpen}>
        Sidebar
      </Sidebar>
    </>
  );
}
