import { Mutex } from 'async-mutex';
import { logout } from '@/features/auth/authSlice';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const mutex = new Mutex();
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const baseQuery = fetchBaseQuery({ baseUrl: `${backendUrl}/api/`, credentials: 'include' });

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  /* Additional request is sent to attempt refreshing auth token */
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery({ url: '/refresh_session', method: 'POST', credentials: 'include' }, api, extraOptions);
        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Chat', 'Groups', 'Posts', 'GroupJoinRequests', 'Group', 'Events', 'Followers', 'FollowRequests', 'GroupInvitations', 'Notification'],
  endpoints: () => ({}),
});
