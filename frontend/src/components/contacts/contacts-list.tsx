'use client';

import { UserType, useSession } from '@/providers/user-provider';
import { Contact } from './contact';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';

interface QueryResponse {
  followers: FollowerType[];
}

export const ContactList = () => {
  const { user } = useSession();

  const contactsQuery = useQuery<QueryResponse>({
    queryKey: ['contacts'],
    queryFn: async () => fetcher(`/api/users/${user?.nickname}/followers`),
  });

  // const groupsQuery = useQuery<QueryResponse>()
  return (
    <div className='m-4 flex h-max w-[350px] flex-col space-y-6 rounded-lg border border-border py-4 sticky top-0'>
      <h1 className='pl-4 font-medium'>Contacts</h1>
      {contactsQuery.isLoading || !contactsQuery.data
        ? [1, 2, 3, 4, 5].map((item) => <div key={item} className='h-[40px] w-[90%] mx-auto animate-pulse bg-secondary rounded-lg' />)
        : contactsQuery.data.followers.map((contact, index) => <Contact key={contact.follower_id} follower={contact} />)}
        <div className='w-full h-[2px] bg-secondary'/>
        <h1 className='pl-4 font-medium'>Group conversations</h1>
    </div>
  );
};
