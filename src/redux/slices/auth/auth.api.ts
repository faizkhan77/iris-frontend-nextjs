import { api } from "@/redux/api/api";
import type { LoginRequest, LoginResponse } from "./types";


export const authapi = api.injectEndpoints({
  overrideExisting : true,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    refresh: builder.query({
      query: (data) => ({
        url: "/auth/refresh",
        method: "GET",
        body: data,
      }),
    }),
    login: builder.mutation<LoginResponse,LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
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
    useRefreshQuery
} = authapi;
