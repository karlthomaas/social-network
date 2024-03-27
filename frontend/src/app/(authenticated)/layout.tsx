import React from 'react';
import axios from 'axios';
import { fetcher, fetcherWithOptions } from '@/lib/fetchers';
import { cookies } from 'next/headers';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // get current cookies
  console.log(cookies());
  const jwtCookie = cookies().get('Token');
  const refreshToken = cookies().get('Refresh-Token');

  try {
    const res = await fetcherWithOptions({
      url: 'http://backend:4000/api/authenticate',
      method: 'GET',
      body: null, // Add this line
      headers: { Authorization: `Bearer ${jwtCookie?.value}`, Cookie: `Refresh-Token=${refreshToken?.value};`},
    });
    console.log(res);
  } catch (error) {
    console.error(error.response.data);
  }

  return <div>{children}</div>;
}
