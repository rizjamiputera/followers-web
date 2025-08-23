import { defineStore } from 'pinia'
import queryString from 'query-string'
import { OrderBy, type Paginate, type PaginationParameters } from '~/interfaces/app-interface'
import type { Event } from '~/interfaces/event-interface'

interface UpcomingEventStoreState {
    data?: Paginate<Event[]>
    parameters: PaginationParameters
    isLoading: boolean
    isError: boolean
}

export const useUpcomingEventStore = defineStore('upcoming-event', {
    state: (): UpcomingEventStoreState => ({
        data: undefined,
        parameters: {
            limit: 4,
            page: 1,
            includes: []
        },
        isLoading: false,
        isError: false
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
                    order: OrderBy.ASC
                },
            });
        },
        events: (state): Event[] => state.data?.data ?? [],
        first_event: (state): Event | null => {
            if (!state.data) return null;
            if (!state.data.data.length) return null;
            return state.data.data[0] as Event;
        },
        from_second_events: (state): Event[] => {
            if (!state.data) return [];
            return state.data.data.slice(1, 4);
        },
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
                this.data = await Api.get(this.apiPath) as Paginate<Event[]>
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
