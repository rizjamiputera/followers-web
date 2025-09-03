import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Content, ContentStats, ReactionType } from '~/interfaces/content-interface';
import type { Event } from '~/interfaces/event-interface';

interface ReadEventStoreState {
    slug?: string
    data?: Event
    parameters: Record<string, any>
    isLoading: boolean
    isError: boolean
    isNotFound: boolean
    stats?: ContentStats
}

export const useReadEventStore = defineStore('read-event', {
    state: (): ReadEventStoreState => ({
        slug: undefined,
        data: undefined,
        parameters: {
            includes: ['content', 'author', 'tags.tag', 'stats', 'registrationConfig', 'userRegistration']
        },
        isLoading: false,
        isError: false,
        isNotFound: false,
        stats: undefined
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/event/read/' + state.slug,
                query: {
                    includes: state.parameters.includes.join(','),
                },
            });
        },
        tags: (state) => state.data?.tags ?? [],
        contentId: (state) => state.data?.content?.id ?? undefined,
        content: (state) => state.data?.content?.content ?? undefined,
        auth_reaction: (state): ReactionType | null => {
            if (state.data) {
                if (state.data.auth_reaction) {
                    return state.data.auth_reaction.type
                }
            }
            return null
        },
    },
    actions: {
        async get() {
            this.isLoading = true;
            this.isError = false;
            this.isNotFound = false;
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));
                const { stats, ...data } = await Api.get(this.apiPath) as Event;

                this.data = data;
                this.stats = stats;
            } catch (error: any) {
                if (error.status == 404) {
                    this.isNotFound = true

                } else {
                    this.isError = true
                }
            } finally {
                this.isLoading = false;
            }
        },
        async getStats() {
            if (!this.data) return;

            const statsId = this.data.statsId;

            this.stats = await Api.get('/v1/content-stats/' + statsId) as ContentStats
        },
        async recordVisit(path: string) {
            if (!this.slug) return;
            const apiUri = useRuntimeConfig().public.apiUri;

            try {
                const auth = useAuthStore();

                let fingerprint = localStorage.getItem('fp')
                if (!fingerprint) {
                    fingerprint = crypto.randomUUID()
                    localStorage.setItem('fp', fingerprint)
                }

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                    'x-fingerprint': fingerprint
                }

                // add token if logged in
                if (auth.access_token) {
                    headers['Authorization'] = `Bearer ${auth.access_token}`
                }

                await $fetch(`${apiUri}/v1/event/visit/${this.slug}`, {
                    method: 'POST',
                    headers,
                    body: {
                        path
                    }
                })
            } catch (error) {
            }
        },
        async recordShare() {
            try {
                if (!this.data) return;
                const id = this.data.id
                await Api.post('/v1/event/share/' + id);
            } catch (error) {
            }
        },
        reset() {
            this.data = undefined;
            this.isLoading = false;
            this.isError = false;
        }
    }
})
