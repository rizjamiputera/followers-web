import { defineStore } from 'pinia'
import queryString from 'query-string'
import type { Article, ArticleStats } from '~/interfaces/article-interface';

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
        stats: (state): ArticleStats => state.data?.stats ?? {
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
        reset() {
            this.data = undefined;
            this.isLoading = false;
            this.isError = false;
        }
    }
})
