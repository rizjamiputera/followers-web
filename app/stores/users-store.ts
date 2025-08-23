import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { Role, User } from '~/interfaces/user-interface'

interface UsersStoreState {
    data?: Paginate<User[]>
    parameters: PaginationParameters
    role?: Role
    search: string
    isLoading: boolean
    isError: boolean
}

export const useUsersStore = defineStore('users', {
    state: (): UsersStoreState => ({
        data: undefined,
        parameters: {
            limit: 10,
            page: 1,
            includes: []
        },
        role: undefined,
        search: '',
        isLoading: false,
        isError: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/user',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    search: state.search,
                    role: state.role,
                    sortBy: 'name',
                    order: 'asc'
                },
            });
        },
        users: (state): User[] => state.data?.data ?? [],
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
                this.data = await Api.get(this.apiPath) as Paginate<User[]>
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
