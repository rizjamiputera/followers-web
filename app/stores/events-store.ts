import { defineStore } from 'pinia'
import queryString from 'query-string'
import { OrderBy, type Paginate, type PaginationParameters } from '~/interfaces/app-interface'
import type { ContentStatus } from '~/interfaces/content-interface'
import type { Event } from '~/interfaces/event-interface'

interface EventsStoreState {
    data?: Paginate<Event[]>
    parameters: PaginationParameters
    search: string
    status?: ContentStatus
    authorId?: string
    tagSlug?: string
    categoryId?: string
    sortBy: string
    order: OrderBy
    sort: string
    isLoading: boolean
    isError: boolean
}

export const useEventsStore = defineStore('events', {
    state: (): EventsStoreState => ({
        data: undefined,
        parameters: {
            limit: 10,
            page: 1,
            includes: ['stats', 'author', 'registrationConfig', 'registeredCount']
        },
        search: '',
        status: undefined,
        authorId: undefined,
        tagSlug: undefined,
        categoryId: undefined,
        sortBy: 'createdAt',
        order: OrderBy.DESC,
        sort: 'newest',
        isLoading: false,
        isError: false
    }),
    getters: {
        apiPath: (state) => {
            const sort = resolveContentSort(state.sort);
            return queryString.stringifyUrl({
                url: '/v1/event',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    search: state.search,
                    authorId: state.authorId,
                    status: state.status,
                    tags: state.tagSlug || undefined,
                    categoryId: state.categoryId || undefined,
                    sortBy: sort.sortBy,
                    order: sort.order
                },
            });
        },
        events: (state): Event[] => state.data?.data ?? [],
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
                this.data = await Api.get(this.apiPath) as Paginate<Event[]>
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
            this.sort = 'newest';
            this.isLoading = false;
            this.isError = false;

            this.parameters.limit = 10;
            this.parameters.page = 1;
        }
    }
})
