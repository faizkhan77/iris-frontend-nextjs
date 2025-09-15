import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";
import { logout, setToken } from "../slices/auth/auth.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL, // ✅ from env
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // ✅ add token if exists
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const authState = (api.getState() as RootState).auth;

  if (result.error && result.error.status === 403) {
    console.log("Yes Got Error");

    // No token or refresh token — logout
    if (!authState.token) {
      api.dispatch(logout());
      return result;
    }

    // Use refresh token to get a new access token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "GET",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).access_token;

      // Update token in store
      api.dispatch(
        setToken({
          token: newAccessToken,
        })
      );

      // Retry original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh token invalid — logout
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Conversations", "SingleConversation", "Messages"], // <-- add tags here
  endpoints: () => ({}), // extend in other files
});