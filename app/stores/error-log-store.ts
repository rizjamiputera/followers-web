import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { ErrorLog, Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { ContentStatus } from '~/interfaces/content-interface'

interface ErrorLogStoreState {
    data?: Paginate<ErrorLog[]>
    parameters: PaginationParameters
    search: string
    status?: ContentStatus
    authorId?: string
    isLoading: boolean
    isError: boolean
}

export const useErrorLogStore = defineStore('error-log', {
    state: (): ErrorLogStoreState => ({
        data: undefined,
        parameters: {
            limit: 10,
            page: 1,
            includes: ['user']
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
                url: '/error-logs',
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
        errorLogs: (state): ErrorLog[] => state.data?.data ?? [],
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
                this.data = await Api.get(this.apiPath) as Paginate<ErrorLog[]>
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
