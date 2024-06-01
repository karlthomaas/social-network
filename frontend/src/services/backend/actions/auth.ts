import { backendApi } from '@/services/backend/backendApi';
import type { RegisterFormProps } from '@/app/(unauthenticated)/register/_components/register-form';
import type { LoginFormProps } from '@/app/(unauthenticated)/login/_components/login-form';

const extendedAuthApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string }, RegisterFormProps>({
      query: (values) => {
        const { confirmPassword, ...rest } = values;
        return {
          url: 'users',
          method: 'POST',
          body: rest,
        };
      },
    }),
    login: builder.mutation<{ message: string }, LoginFormProps>({
      query: ({ email, password }) => ({
        url: 'login',
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${email}:${password}`) },
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = extendedAuthApi;
