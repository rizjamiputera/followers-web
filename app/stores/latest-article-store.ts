import { defineStore } from 'pinia'
import queryString from 'query-string'

interface User {
    id: string
    name: string
    email: string
    avatar: string
    avatar_md: string
}

export interface Paginate<T> {
    data: T;
    limit: number;
    total: number;
    page: number;
    last_page: number;
}
export interface PaginationParameters {
    limit: number
    page: number
}

interface Article {
    id: string
    slug: string
    title: string
    excerpt: string
    image: string
    image_sm: string
    // content     ArticleContent          @relation(fields: [contentId], references: [id], onDelete: Restrict)
    // contentId   :string
    // versions    ArticleContentVersion[]
    // isFeatured  Boolean                 @default(false)
    // status      ArticleStatus           @default(DRAFT)
    // publishedAt DateTime? // actual publish time
    author: User
    authorId: string
    // approvals   ArticleApproval[]
    // tags        ArticleTag[]
    // comments    Comment[]
    // reactions   ArticleReaction[]
    // createdAt   DateTime @default (now())
    // updatedAt   DateTime @updatedAt
    // deleted     Boolean @default (false)
    // readStat    ArticleReadStat @relation(fields: [readStatId], references: [id], onDelete: Restrict)
    // readStatId: string
    // visitors    Visit[]
}

interface LatestArticleStoreState {
    data?: Paginate<Article[]>
    parameters: PaginationParameters
    isLoading: boolean
    isError: boolean
}

export const useLatestArticleStore = defineStore('latest-article', {
    state: (): LatestArticleStoreState => ({
        data: undefined,
        parameters: {
            limit: 12,
            page: 1
        },
        isLoading: false,
        isError: false
    }),
    getters: {
        apiPath: (state) => {
            return queryString.stringifyUrl({
                url: '/v1/article/published',
                query: {
                    limit: state.parameters.limit,
                    page: state.parameters.page,
                },
            });
        },
        latest_articles: (state): Article[] => state.data?.data ?? [],
        page: (state): number | string => state.data?.page ?? '-',
        last_page: (state): number => state.data?.last_page ?? 0,
        total: (state): number => state.data?.total ?? 0,
    },
    actions: {
        async get() {
            this.reset();
            this.isLoading = true;
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));
                this.data = await Api.get(this.apiPath) as Paginate<Article[]>
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
