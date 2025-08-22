import type { Content, ContentStats, ContentStatus, Tag } from "./content-interface"
import type { User } from "./user-interface"

export interface Event {
    id: string
    slug: string
    title: string
    excerpt: string
    image: string
    image_md: string
    content?: Content
    location?: string
    address?: string
    start_at: string
    end_at?: string
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
