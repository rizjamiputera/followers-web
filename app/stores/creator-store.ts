import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Paginate, PaginationParameters } from '~/interfaces/app-interface'
import type { ContentStatus } from '~/interfaces/content-interface'
import type { Profile } from '~/interfaces/user-interface'

interface CretorStoreState {
    data?: Paginate<Profile[]>
    parameters: PaginationParameters
    search: string
    isLoading: boolean
    isError: boolean
    isPublicApi?: boolean
    isPublic?: boolean | string
}

export const useCreatorStore = defineStore('creator', {
    state: (): CretorStoreState => ({
        data: undefined,
        parameters: {
            limit: 12,
            page: 1,
            includes: ['user', 'socialLinks']
        },
        search: '',
        isLoading: false,
        isError: false,
        isPublicApi: false,
        isPublic: undefined
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: `/v1/creator${state.isPublicApi ? '/public' : ''}`,
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                    includes: state.parameters.includes.join(','),
                    search: state.search,
                    sortBy: 'slug',
                    order: 'desc',
                    ...((state.isPublic !== undefined && state.isPublic !== '') && {
                        isPublic: state.isPublic
                    })
                }
            });
        },
        creators: (state): Profile[] => state.data?.data ?? [],
        page: (state): number | string => state.data?.page ?? '-',
        last_page: (state): number => state.data?.last_page ?? 0,
        total: (state): number => state.data?.total ?? 0,
        isEmpty: (state): boolean => state.data ? (state.data.data.length ? false : true) : false,
    },
    actions: {
        async get(reset = true) {
            if (reset) {
                this.isLoading = true;
                this.data = undefined;
            }
            try {
                const response = await Api.get(this.apiPath) as Paginate<Profile[]>;

                if (reset || this.parameters.page === 1) {
                    this.data = response;
                } else {
                    // Append data for load more functionality
                    this.data = {
                        ...response,
                        data: [...(this.data?.data ?? []), ...response.data]
                    };
                }
            } catch (error) {
                this.isError = true
            } finally {
                this.isLoading = false;
            }
        },
        reset() {
            this.data = undefined;

            this.search = '';
            this.isLoading = false;
            this.isError = false;
            this.isPublicApi = undefined;
            this.isPublic = undefined;

            this.parameters.limit = 12;
            this.parameters.page = 1;
        }
    }
})
