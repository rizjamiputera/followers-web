import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Article } from '~/interfaces/article-interface';

interface ReadArticleStoreState {
    slug?: string
    data?: Article
    parameters: Record<string, any>
    isLoading: boolean
    isError: boolean
}

export const useReadArticleStore = defineStore('read-article', {
    state: (): ReadArticleStoreState => ({
        slug: undefined,
        data: undefined,
        parameters: {
            includes: ['content', 'author', 'tags.tag']
        },
        isLoading: false,
        isError: false
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
    },
    actions: {
        async get() {
            this.reset();
            this.isLoading = true;
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));
                this.data = await Api.get(this.apiPath) as Article
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
