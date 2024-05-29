'use client';

import { Contact } from './contact';
import { useAppSelector } from '@/lib/hooks';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';
import { useGetSessionUserGroupsQuery, useGetUserFollowersQuery } from '@/services/backend/backendApi';
import { skipToken } from '@reduxjs/toolkit/query';

interface ContactsQueryResponse {
  followers: FollowerType[];
}

export const ContactList = () => {
  const { user } = useAppSelector((state) => state.auth)

  const groupsQuery = useGetSessionUserGroupsQuery();
  const contactsQuery =  useGetUserFollowersQuery(user?.nickname ?? skipToken, {skip: !user});

  return (
    <div className='sticky top-0 m-4 hidden h-max w-[350px] flex-col space-y-6 rounded-lg border border-border py-4 lg:flex'>
      <h1 className='pl-4 font-medium'>Contacts</h1>
      {contactsQuery.isLoading || !contactsQuery.data ? (
        [1, 2, 3, 4, 5].map((item) => <div key={item} className='mx-auto h-[40px] w-[90%] animate-pulse rounded-lg bg-secondary' />)
      ) : contactsQuery.data.followers.length === 0 ? (
        <h1 className='ml-4 mt-2 text-neutral-600'>No contacts...</h1>
      ) : (
        contactsQuery.data.followers.map((contact) => (
          <Contact
            key={contact.follower_id}
            id={contact.follower_id}
            type='private'
            name={`${contact.user.first_name} ${contact.user.last_name}`}
          />
        ))
      )}
      <div className='h-[2px] w-full bg-secondary' />
      <h1 className='pl-4 font-medium'>Group conversations</h1>
      {groupsQuery.isLoading || !groupsQuery.data ? (
        [1, 2, 3, 4, 5].map((item) => <div key={item} className='mx-auto h-[40px] w-[90%] animate-pulse rounded-lg bg-secondary' />)
      ) : groupsQuery.data.groups.length === 0 ? (
        <h1 className='ml-4 mt-2 text-neutral-600'>No groups...</h1>
      ) : (
        groupsQuery.data.groups.map((group) => <Contact key={group.id} id={group.id} type='group' name={group.title} />)
      )}
    </div>
  );
};
