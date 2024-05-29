'use client';

import { UserType, useSession } from '@/providers/user-provider';
import { Contact } from './contact';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { FollowerType } from '@/app/(authenticated)/groups/[id]/_components/group-invite-content';
import { GroupType } from '@/app/(authenticated)/groups/page';
import { useGetSessionUserGroupsQuery } from '@/services/backendApi';

interface ContactsQueryResponse {
  followers: FollowerType[];
}

interface GroupsQueryResponse {
  groups: GroupType[];
}

export const ContactList = () => {
  const { user } = useSession();

  const groupsQuery = useGetSessionUserGroupsQuery();

  const contactsQuery = useQuery<ContactsQueryResponse>({
    queryKey: ['contacts'],
    queryFn: async () => fetcher(`/api/users/${user?.nickname}/followers`),
  });

  return (
    <div className='sticky top-0 m-4 flex h-max w-[350px] flex-col space-y-6 rounded-lg border border-border py-4'>
      <h1 className='pl-4 font-medium'>Contacts</h1>
      {contactsQuery.isLoading || !contactsQuery.data
        ? [1, 2, 3, 4, 5].map((item) => <div key={item} className='mx-auto h-[40px] w-[90%] animate-pulse rounded-lg bg-secondary' />)
        : contactsQuery.data.followers.map((contact) => (
            <Contact
              key={contact.follower_id}
              id={contact.follower_id}
              type='private'
              name={`${contact.user.first_name} ${contact.user.last_name}`}
            />
          ))}
      <div className='h-[2px] w-full bg-secondary' />
      <h1 className='pl-4 font-medium'>Group conversations</h1>
      {groupsQuery.isLoading || !groupsQuery.data
        ? [1, 2, 3, 4, 5].map((item) => <div key={item} className='mx-auto h-[40px] w-[90%] animate-pulse rounded-lg bg-secondary' />)
        : groupsQuery.data.groups.map((group) => <Contact key={group.id} id={group.id} type='group' name={group.title} />)}
    </div>
  );
};
