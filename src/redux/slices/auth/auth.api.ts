import { api } from "@/redux/api/api";
import type {
  LoginRequest,
  LoginResponse,
  NuqiLoginRequest,
  NuqiLoginResponse,
  RefreshTokenResponse,
} from "./types";

export const authapi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    refresh: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        credentials: "include",
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    wealthLogin: builder.mutation<NuqiLoginResponse, NuqiLoginRequest>({
      query: (data) => ({
        url: "/auth/nuqiwealth/login",
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: (data) => ({
        url: "/auth/user",
        method: "GET",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useWealthLoginMutation
} = authapi;
