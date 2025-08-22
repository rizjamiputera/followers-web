import type { User } from "./user-interface"

export interface Article {
    id: string
    slug: string
    title: string
    excerpt: string
    image: string
    image_md: string
    content?: Content
    // contentId   :string
    // versions    ArticleContentVersion[]
    // isFeatured  Boolean                 @default(false)
    status: ContentStatus
    publishedAt?: string // actual publish time
    author?: User
    authorId: string
    // approvals   ArticleApproval[]
    tags?: Tag[]
    // comments?: Comment[]
    // reactions   ArticleReaction[]
    createdAt: string
    // updatedAt   DateTime @updatedAt
    // deleted     Boolean @default (false)
    stats?: ContentStats
    // readStatId: string
    // visitors    Visit[]
}

export type ContentStatus =
    "DRAFT" |
    "ON_REVIEW" |
    "REJECTED" |
    "PUBLISHED" |
    "TAKE_DOWN";

export const contentStatuses: ContentStatus[] = [
    "DRAFT",
    "ON_REVIEW",
    "REJECTED",
    "PUBLISHED",
    "TAKE_DOWN",
];


export interface Content {
    content: {
        content: Record<string, any>
        type: string
    }
}

export interface Tag {
    id: string
    name: string
    slug: string
}

export interface Comment {
    id: string
    user?: User
    content: string
    parent?: Comment
    mentioned?: User
    createdAt: string
    replies?: Comment[]
}

export interface ContentStats {
    // lastReadAt: string
    commentCount: number
    readCount: number
    likeCount: number
    dislikeCount: number
    shareCount: number
    bookmarkCount: number
}
export interface PhotoContent {
    path: string
}
