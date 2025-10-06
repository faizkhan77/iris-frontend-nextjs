import { api } from "@/redux/api/api"
import type { NewsArticle } from "./types"

interface GetNewsParams {
    news_type: string;
    limit?: number;
    offset?: number;
    order?: "asc" | "desc";
}

export const newsApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getNews: builder.query<NewsArticle[], GetNewsParams>({
            query: ({ news_type, limit = 20, offset = 0, order = "desc"  }) => ({
                url: "/news/get-news",
                method: "GET",

                params: { news_type, limit, offset, order },
            }),
        }),
    }),
});

export const { useGetNewsQuery } = newsApi;