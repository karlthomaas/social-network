'use client';

import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { NavbarProfile } from './buttons/navbar-profile';
import { useSesssion } from '@/providers/user-provider';
import { useMemo } from 'react';
import { LoginButton } from './buttons/login-btn';

export default function Navbar({ authenticate = false }) {
  const { user, isLoading } = useSesssion();

  const navbarButton = useMemo(() => {
    if (!authenticate) {
      return <LoginButton />;
    } else if (isLoading) {
      return <div className='aspect-square w-[40px] animate-pulse rounded-full bg-secondary' />;
    } else if (user) {
      return <NavbarProfile />;
    } else {
      return <LoginButton />;
    }
  }, [authenticate, isLoading, user]);

  return (
    <nav className='h-[65px] w-full border-b-[1px] border-border'>
      <ul className='mx-auto flex h-full max-w-screen-md items-center justify-between p-4'>
        <li>
          <Link href='/' className='flex items-center space-x-4'>
            <div className='h-[30px] w-[30px] rounded-lg bg-secondary' />
            <p className='text-lg'>Social Network</p>
          </Link>
        </li>
        <li className='md:hidden'>
          <Button size='sm' variant='ghost'>
            <Menu size={25} />
          </Button>
        </li>
        {navbarButton}
      </ul>
    </nav>
  );
}
