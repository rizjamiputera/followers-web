import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { Comment } from '~/interfaces/content-interface'

interface CommentsStoreState {
    contentId?: string
    data?: Paginate<Comment[]>
    parameters: PaginationParameters
    isLoading: boolean
    isError: boolean
    comments: Comment[]
}

export const useCommentsStore = defineStore('comments', {
    state: (): CommentsStoreState => ({
        contentId: undefined,
        data: undefined,
        parameters: {
            limit: 12,
            page: 1,
            includes: ['user', 'reactions']
        },
        isLoading: false,
        isError: false,
        comments: []
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/comment',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    contentId: state.contentId,
                    sortBy: 'createdAt',
                    order: 'desc'
                },
            });
        },
        page: (state): number | string => state.data?.page ?? '-',
        last_page: (state): number => state.data?.last_page ?? 0,
        total: (state): number => state.data?.total ?? 0,
    },
    actions: {
        async get(reset = true) {
            if (reset) this.reset();
            this.isLoading = true;
            try {
                // await new Promise((resolve) => setTimeout(resolve, 400));
                const response = await Api.get(this.apiPath) as Paginate<Comment[]>
                this.data = response;

                if (reset) {
                    this.comments = response.data;
                } else {
                    this.comments = [
                        ...this.comments,
                        ...response.data
                    ]
                }
            } catch (error) {
                this.isError = true
            } finally {
                this.isLoading = false;
            }
        },
        loadMore() {
            ++this.parameters.page;
            this.get(false);
        },
        reset() {
            this.data = undefined;
            this.isLoading = false;
            this.isError = false;
        }
    }
})
