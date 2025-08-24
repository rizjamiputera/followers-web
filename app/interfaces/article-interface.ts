import type { Content, ContentStats, ContentStatus, Tag } from "./content-interface"
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
    auth_reaction: {
        type: ReactionType
    },
    authBookmark?: boolean
}

export enum ReactionType {
    like = "like",
    dislike = "dislike",
}

