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

  const { data, isLoading } = useQuery<QueryResponse>({
    queryKey: ['contacts'],
    queryFn: async () => fetcher(`/api/users/${user?.nickname}/followers`),
  });

  return (
    <div className='m-4 flex h-max w-[350px] flex-col space-y-6 rounded-lg border border-border py-4'>
      <h1 className='pl-4'>Contact list</h1>
      {isLoading || !data
        ? [1, 2, 3, 4, 5].map(() => <div className='h-[40px] w-[90%] mx-auto animate-pulse bg-secondary rounded-lg' />)
        : data.followers.map((contact) => <Contact key={contact.user.id} follower={contact} />)}
    </div>
  );
};
