'use client';

import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { NavbarProfile } from './buttons/navbar-profile';

export default function Navbar({ authenticate = false }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      return fetcher('/api/users/me');
    },
    enabled: authenticate,
  });

  let navbarButton = null;

  if (isLoading) {
    navbarButton = <div className='aspect-square w-[40px] animate-pulse rounded-full bg-secondary' />;
  } else if (data && !isError) {
    navbarButton = <NavbarProfile profile={`${data.user.first_name}.${data.user.last_name}`} />;
  } else {
    navbarButton = (
      <Link href='/register'>
        <Button size='sm'>Sign up</Button>
      </Link>
    );
  }

  return (
    <nav className='h-[65px] w-full border-b-[1px] border-border'>
      <ul className='mx-auto flex h-full max-w-screen-lg items-center justify-between p-4'>
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
