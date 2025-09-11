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
    latest_articles: Article[]
}

export const useLatestArticleStore = defineStore('latest-article', {
    state: (): LatestArticleStoreState => ({
        data: undefined,
        parameters: {
            limit: 6,
            page: 1,
            includes: ['author', 'tags.tag']
        },
        authorId: undefined,
        isLoading: true,
        isError: false,
        latest_articles: []
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
        page: (state): number | string => state.data?.page ?? '-',
        last_page: (state): number => state.data?.last_page ?? 0,
        total: (state): number => state.data?.total ?? 0,
        isEmpty: (state): boolean => state.data ? (state.data.data.length ? false : true) : false,
    },
    actions: {
        async get() {
            this.isLoading = true;
            this.isError = false;

            try {
                // await new Promise((resolve) => setTimeout(resolve, 400));
                const response = await Api.get(this.apiPath) as Paginate<Article[]>
                this.data = response;

                this.latest_articles = [
                    ...this.latest_articles,
                    ...response.data
                ]
            } catch (error) {
                this.isError = true
            } finally {
                this.isLoading = false;
            }
        },
        reset() {
            this.parameters.page = 1;
            this.isError = false;
            this.data = undefined;
            this.latest_articles = [];
        }
    }
})
