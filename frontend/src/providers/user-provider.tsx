'use client';

import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';

import { fetcher } from '@/lib/fetchers';

const useUserStore = create(() => ({
  user: null,
}));

const SessionContext = createContext<ContextProps>({ user: null, isLoading: true });

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((state: any) => state.user);
  const { data, isError, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      return fetcher('/api/users/me');
    },
  });

  useEffect(() => {
    if (isError || !data) {
      useUserStore.setState({ user: null });
      return;
    }
    useUserStore.setState({ user: data.user });
  }, [data, isError]);

  return <SessionContext.Provider value={{ user, isLoading }}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  return useContext(SessionContext);
};

export interface UserType {
  id: string;
  about_me: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  privacy: string;
  image: string | null;
}

interface ContextProps {
  user: UserType | null;
  isLoading: boolean;
}
