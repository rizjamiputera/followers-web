import type { Category } from "./category-interface"
import type { Content, ContentStats, ContentStatus, ReactionType, Tag } from "./content-interface"
import type { User } from "./user-interface"
import type { Speaker, ContentSpeakerInput } from "./speaker-interface"


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
    category?: Category | null
    categoryId?: string | null
    // approvals   ArticleApproval[]
    tags?: Tag[]
    speakers?: (Speaker & { role?: string | null })[]
    // comments?: Comment[]
    // reactions   ArticleReaction[]
    createdAt: string
    // updatedAt   DateTime @updatedAt
    // deleted     Boolean @default (false)
    stats?: ContentStats
    statsId: string
    // readStatId: string
    // visitors    Visit[]
    auth_reaction: {
        type: ReactionType
    },
    authBookmark?: boolean
}

export interface ArticleDto extends Omit<Article, 'tags' | 'speakers'> {
    tags?: string[]
    speakers?: ContentSpeakerInput[]
}
