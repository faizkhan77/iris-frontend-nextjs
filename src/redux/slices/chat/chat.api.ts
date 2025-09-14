import { api } from "@/redux/api/api";
import type { ChatSession, Conversation } from "./types"; // define Conversation type according to your response

export const chatapi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getConversations: builder.query<{ conversations: Conversation[] }, void>({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
    }),
    getSingleConversation: builder.query<ChatSession ,string>({
      query: (id) => ({
        url: `/chat/conversation/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetConversationsQuery,useGetSingleConversationQuery } = chatapi;
