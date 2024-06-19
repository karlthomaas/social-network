import React from 'react';
import Navbar from '@/components/navbar';
import { ContactList } from '@/components/contacts/contacts-list';
import { Chats } from '@/components/chat/chats';
import { SearchUsers } from '@/components/search-users';
import { Menu } from '@/components/menu';

export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return (
    <>
      <Navbar />
      <div className='flex justify-center'>
        <div className='sticky top-0 m-4 hidden h-max w-[370px] lg:flex'>
          <Menu />
        </div>
        <main className='relative h-full w-full max-w-screen-md p-4'>{children}</main>
        <div className='sticky top-2 m-4 hidden h-max w-[370px] flex-col space-y-5 lg:flex'>
          <SearchUsers />
          <ContactList />
        </div>
        <Chats />
      </div>
    </>
  );
}
