import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendUrl}/api/`, credentials: 'include' }),
  tagTypes: ['Chat', 'Groups', 'Posts', 'GroupJoinRequests', 'Group', 'Events', 'Followers'],
  endpoints: () => ({}),
});
