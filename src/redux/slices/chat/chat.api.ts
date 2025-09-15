import { api } from "@/redux/api/api";
import type { AiResponse, ChatRequest, ChatSession, Conversation } from "./types"; // define Conversation type according to your response

export const chatapi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getConversations: builder.query<{ conversations: Conversation[] }, void>({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
    }),
    getSingleConversation: builder.query<ChatSession, string>({
      query: (id) => ({
        url: `/chat/conversation/${id}`,
        method: "GET",
      }),
      providesTags : (_result, _error, id)=>([{type:"SingleConversation",id}])
    }),
    createConversation: builder.mutation<
      { chat_session_id: string; started_at: string },
      void
    >({
      query: () => ({
        url: "/chat/conversation",
        method: "POST",
      }),
    }),
    sendMessage : builder.mutation<{message : AiResponse},ChatRequest>({
      query : (arg)=>({
        url : "/chat/send",
        method :  "POST",
        body : arg
      }),
      invalidatesTags : (_result, _error, arg)=>([
        {type : "Conversations",id : arg.chat_session_id},
        "Messages"
      ])
    })
  }),
});

export const {
  useGetConversationsQuery,
  useGetSingleConversationQuery,
  useCreateConversationMutation,
  useSendMessageMutation
} = chatapi;
