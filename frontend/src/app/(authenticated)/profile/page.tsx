'use client';

import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`/profile/${user.nickname}`);
    }
  }, [user, router]);

  return <div></div>;
}
