import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { Article, ContentStatus } from '~/interfaces/article-interface'

interface MyArticlesStoreState {
    data?: Paginate<Article[]>
    parameters: PaginationParameters
    search: string
    status?: ContentStatus
    isLoading: boolean
    isError: boolean
}

export const useMyArticlesStore = defineStore('my-articles', {
    state: (): MyArticlesStoreState => ({
        data: undefined,
        parameters: {
            limit: 10,
            page: 1,
            includes: ['stats']
        },
        search: '',
        status: undefined,
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
        async get(reset = true) {
            if (reset) {
                this.reset();
                this.isLoading = true;
            }
            try {
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
