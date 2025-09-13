import { api } from "@/redux/api/api";
import type { Conversation } from "./types"; // define Conversation type according to your response

export const chatApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => ({
        url: "/chat/Conversations",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetConversationsQuery } = chatApi;
