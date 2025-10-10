import { api } from "@/redux/api/api"
import type { NewsArticle } from "./types"

interface GetNewsParams {
    news_type: string;
    limit?: number;
    offset?: number;
    order?: "asc" | "desc";
}

interface SearchNewsParams {
    query: string;
    limit?: number;
    offset?: number;
}

export const newsApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getNews: builder.query<NewsArticle[], GetNewsParams>({
            query: ({ news_type, limit = 20, offset = 0, order = "desc" }) => ({
                url: "/news/get-news",
                method: "GET",

                params: { news_type, limit, offset, order },
            }),
        }),
        searchCompanyNews: builder.query<NewsArticle[], SearchNewsParams>({
            query: ({ query, limit = 20, offset = 0 }) => {
                // This logic determines whether to use the 'fincode' or 'name' parameter.
                const isFincode = !isNaN(parseInt(query, 10));

                const params = {
                    limit,
                    offset,
                    ...(isFincode ? { fincode: query } : { name: query }),
                };

                return {
                    url: "/news/by-company",
                    method: "GET",
                    params,
                };
            },
        }),
    }),
});

export const { useGetNewsQuery, useLazySearchCompanyNewsQuery } = newsApi;