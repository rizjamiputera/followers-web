import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { Article, ArticleStatus } from '~/interfaces/article-interface'

interface MyArticleStoreState {
    data?: Paginate<Article[]>
    parameters: PaginationParameters
    search: string
    status?: ArticleStatus
    authorId?: string
    isLoading: boolean
    isError: boolean
}

export const useMyArticleStore = defineStore('my-article', {
    state: (): MyArticleStoreState => ({
        data: undefined,
        parameters: {
            limit: 10,
            page: 1,
            includes: ['stats']
        },
        search: '',
        status: undefined,
        authorId: undefined,
        isLoading: false,
        isError: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/article/my-article',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    search: state.search,
                    authorId: state.authorId,
                    status: state.status,
                    sortBy: 'createdAt',
                    order: 'desc'
                },
            });
        },
        articles: (state): Article[] => state.data?.data ?? [],
        page: (state): number | string => state.data?.page ?? '-',
        last_page: (state): number => state.data?.last_page ?? 0,
        total: (state): number => state.data?.total ?? 0,
        isEmpty: (state): boolean => state.data ? (state.data.data.length ? false : true) : false,
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
