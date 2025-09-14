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
      })
    })
    // sendChatStream: builder.query({
    //   query: () => ({
    //     url: "/chat/stream",
    //     method: "GET",
    //   }),
    //   // Use this to handle SSE streaming
    //   async onCacheEntryAdded(
    //     arg,
    //     { dispatch, cacheDataLoaded, cacheEntryRemoved }
    //   ) {
    //     // Wait until mutation is "committed"
    //     await cacheDataLoaded;
    //     // Open EventSource for streaming
        
    //     const eventSource = new EventSource(
    //       `/api/chat/stream?message=good morning buddy&chat_session_id=4eb3f93f-3234-418a-ba58-42afacb73199`
    //     );

    //     eventSource.onmessage = (event: MessageEvent) => {
    //       console.log("EVENT", event);
    //     };
    //     // Cleanup when subscription ends
    //     await cacheEntryRemoved;
    //     eventSource.close();
    //   },
    // }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetSingleConversationQuery,
  useCreateConversationMutation,
  useSendMessageMutation
} = chatapi;
