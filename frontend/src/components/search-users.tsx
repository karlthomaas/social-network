'use client';

import { ProfilePicture } from '@/app/(authenticated)/profile/[user]/_components/pfp';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/spinners';
import { UserType } from '@/features/auth/types';
import { useDebouncedValue, useOutsideClick } from '@/lib/hooks';
import { capitalize } from '@/lib/utils';
import { useGetUsersQuery } from '@/services/backend/actions/user';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export const SearchUsers = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, isLoading] = useDebouncedValue(inputValue, 500);
  const { data } = useGetUsersQuery(debouncedValue, { skip: !debouncedValue });

  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState<UserType[]>([]);

  const resultsRef = React.useRef<HTMLDivElement>(null);
  const searchRef = useOutsideClick(() => setIsActive(false), [resultsRef]);

  const onSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  };

  useEffect(() => {
    if (data?.users) {
      setResults(data.users);
    }
  }, [data]);

  return (
    <div className='relative w-full'>
      <Input ref={searchRef} onFocus={() => setIsActive(true)} onKeyUp={onSearchChange} placeholder='Search users' />
      {isActive && inputValue && (
        <div ref={resultsRef} className='absolute top-12 z-40 min-h-[70px] w-full rounded-xl border border-border bg-background'>
          {isLoading ? (
            <div className='flex h-[100px] w-full items-center justify-center'>
              <LoadingSpinner />
            </div>
          ) : results.length === 0 ? (
            <h1 className='mt-4 text-center text-neutral-600'>No results...</h1>
          ) : (
            <div className='flex flex-col space-y-1'>
              {results.map((user, index) => (
                <SearchUser
                  key={user.id}
                  user={user}
                  callback={() => {
                    setIsActive(false);
                    setInputValue('');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchUser = ({ user, callback }: { user: UserType; callback: () => void }) => {
  return (
    <Link
      href={`/profile/${user.nickname}`}
      className='flex h-[70px] w-full items-center space-x-2 px-2 py-2 transition-all duration-200 ease-in-out first:rounded-t-lg last:rounded-b-lg hover:bg-secondary/70'
      onClick={callback}
    >
      <ProfilePicture url={user.image} className='size-[45px]' />
      <div className='flex flex-col'>
        <h2 className='text-sm'>
          {capitalize(user.first_name)} {capitalize(user.last_name)}
        </h2>
        <h3 className='text-sm text-neutral-400'>@{user.nickname}</h3>
      </div>
    </Link>
  );
};
