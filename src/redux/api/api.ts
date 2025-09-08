import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "@/redux/store"


const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL, // ✅ from env
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    if (token) {
      headers.set("Authorization", `Bearer ${token}`) // ✅ add token if exists
    }
    headers.set("Content-Type", "application/json")
    return headers
  },
})


export const api = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}), // extend in other files
})
