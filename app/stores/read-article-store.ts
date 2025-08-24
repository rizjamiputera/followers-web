import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Article } from '~/interfaces/article-interface';
import type { ContentStats } from '~/interfaces/content-interface';

interface ReadArticleStoreState {
    slug?: string
    data?: Article
    parameters: Record<string, any>
    isLoading: boolean
    isError: boolean
    isNotFound: boolean
}

export const useReadArticleStore = defineStore('read-article', {
    state: (): ReadArticleStoreState => ({
        slug: undefined,
        data: undefined,
        parameters: {
            includes: ['content', 'author', 'tags.tag', 'stats']
        },
        isLoading: false,
        isError: false,
        isNotFound: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/article/read/' + state.slug,
                query: {
                    includes: state.parameters.includes.join(','),
                },
            });
        },
        tags: (state) => state.data?.tags ?? [],
        content: (state) => state.data?.content?.content ?? undefined,
        stats: (state): ContentStats => state.data?.stats ?? {
            commentCount: 0,
            readCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            shareCount: 0,
            bookmarkCount: 0,
        },
    },
    actions: {
        async get() {
            this.isLoading = true;
            this.isError = false;
            this.isNotFound = false;
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));
                this.data = await Api.get(this.apiPath) as Article
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

                await $fetch(`${apiUri}/v1/article/visit/${this.slug}`, {
                    method: 'POST',
                    headers,
                    body: {
                        path
                    }
                })
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
