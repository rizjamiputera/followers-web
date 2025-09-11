import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import queryString from 'query-string'
import { OrderBy, type Paginate, type PaginationParameters } from '~/interfaces/app-interface'
import type { Event } from '~/interfaces/event-interface'

interface PastEventStoreState {
    data?: Paginate<Event[]>
    parameters: PaginationParameters
    isLoading: boolean
    isError: boolean
    isEmpty: boolean
}

export const usePastEventStore = defineStore('past-event', {
    state: (): PastEventStoreState => ({
        data: undefined,
        parameters: {
            limit: 6,
            page: 1,
            includes: ['tags.tag']
        },
        isLoading: true,
        isError: false,
        isEmpty: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/event/published',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    sortBy: 'start_at',
                    order: OrderBy.DESC,
                    past: 'true'
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
        async get() {
            this.reset();
            this.isLoading = true;
            try {
                // await new Promise((resolve) => setTimeout(resolve, 4000));
                this.data = await Api.get(this.apiPath) as Paginate<Event[]>

                if (this.data.data.length) {
                    this.isEmpty = true;
                }
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
