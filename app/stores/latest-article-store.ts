import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { Article } from '~/interfaces/article-interface'

interface LatestArticleStoreState {
    data?: Paginate<Article[]>
    parameters: PaginationParameters
    authorId?: string
    isLoading: boolean
    isError: boolean
}

export const useLatestArticleStore = defineStore('latest-article', {
    state: (): LatestArticleStoreState => ({
        data: undefined,
        parameters: {
            limit: 12,
            page: 1,
            includes: ['author']
        },
        authorId: undefined,
        isLoading: false,
        isError: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/article/published',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    authorId: state.authorId,
                    sortBy: 'publishedAt',
                    order: 'desc'
                },
            });
        },
        latest_articles: (state): Article[] => state.data?.data ?? [],
        page: (state): number | string => state.data?.page ?? '-',
        last_page: (state): number => state.data?.last_page ?? 0,
        total: (state): number => state.data?.total ?? 0,
    },
    actions: {
        async get() {
            this.reset();
            this.isLoading = true;
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));
                this.data = await Api.get(this.apiPath) as Paginate<Article[]>
            } catch (error) {
                this.isError = true
            } finally {
                this.isLoading = false;
            }
        },
        reset() {
            this.data = undefined;
            this.isLoading = false;
            this.isError = false;
        }
    }
})
