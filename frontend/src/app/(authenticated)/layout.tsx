import React from 'react';
import Navbar from '@/components/navbar';
import { SessionProvider } from '@/providers/user-provider';

export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return (
    <SessionProvider>
      <Navbar authenticate={true} />
      <main className='relative mx-auto h-full w-full max-w-screen-md p-4'>{children}</main>
    </SessionProvider>
  );
}
