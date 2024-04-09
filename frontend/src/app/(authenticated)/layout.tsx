import React from 'react';
import Navbar from '@/components/navbar';

export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return (
    <>
      <Navbar authenticate={true} />
      <div className='relative mx-auto h-full w-full max-w-screen-md p-4'>{children}</div>
    </>
  );
}
