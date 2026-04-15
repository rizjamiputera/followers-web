import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { Article } from '~/interfaces/article-interface'
import type { ContentStatus } from '~/interfaces/content-interface'

interface ArticlesStoreState {
    data?: Paginate<Article[]>
    parameters: PaginationParameters
    search: string
    status?: ContentStatus
    authorId?: string
    tagSlug?: string
    categoryId?: string
    isLoading: boolean
    isError: boolean
}

export const useArticlesStore = defineStore('articles', {
    state: (): ArticlesStoreState => ({
        data: undefined,
        parameters: {
            limit: 10,
            page: 1,
            includes: ['stats', 'author']
        },
        search: '',
        status: undefined,
        authorId: undefined,
        tagSlug: undefined,
        categoryId: undefined,
        isLoading: false,
        isError: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/article',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    search: state.search,
                    authorId: state.authorId,
                    status: state.status,
                    tags: state.tagSlug || undefined,
                    categoryId: state.categoryId || undefined,
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

            this.search = '';
            this.status = undefined;
            this.authorId = undefined;
            this.tagSlug = undefined;
            this.categoryId = undefined;
            this.isLoading = false;
            this.isError = false;

            this.parameters.limit = 10;
            this.parameters.page = 1;
        }
    }
})
