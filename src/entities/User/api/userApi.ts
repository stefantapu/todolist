import { rtkApi } from '../../../shared/api/rtkAPI';
import type { UserType } from '../model/userType';

export interface AuthPayload {
  username: string;
  password?: string;
}

export const userApi = rtkApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<UserType, AuthPayload>({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<void, AuthPayload>({
      query: credentials => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = userApi;
