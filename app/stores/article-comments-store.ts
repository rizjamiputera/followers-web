import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { Comment } from '~/interfaces/article-interface'

interface ArticleCommentsStoreState {
    articleId?: string
    data?: Paginate<Comment[]>
    parameters: PaginationParameters
    isLoading: boolean
    isError: boolean
}

export const useArticleCommentsStore = defineStore('article-comments', {
    state: (): ArticleCommentsStoreState => ({
        articleId: undefined,
        data: undefined,
        parameters: {
            limit: 12,
            page: 1,
            includes: ['user', 'replies']
        },
        isLoading: false,
        isError: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/comment',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    articleId: state.articleId,
                    sortBy: 'createdAt',
                    order: 'desc'
                },
            });
        },
        comments: (state): Comment[] => state.data?.data ?? [],
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
                this.data = await Api.get(this.apiPath) as Paginate<Comment[]>
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
