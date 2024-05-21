import React from 'react';
import Navbar from '@/components/navbar';
import { SessionProvider } from '@/providers/user-provider';
import { ContactList } from '@/components/contacts/contacts-list';
import { Chats } from '@/components/chat/chats';


export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return (
    <SessionProvider>
      <Navbar authenticate={true} />
      <div className='flex justify-center'>
        <div className='w-[350px] m-4'>Menu</div>
        <main className='relative h-full w-full max-w-screen-md p-4'>{children}</main>
        <ContactList />
        <Chats />
      </div>
    </SessionProvider>
  );
}
