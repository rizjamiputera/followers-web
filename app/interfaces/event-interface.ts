import type { Content, ContentStats, ContentStatus, ReactionType, Tag } from "./content-interface"
import type { User } from "./user-interface"
import type { EventRegistrationConfig, EventRegistration } from "./event-registration-interface"

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
    statsId: string
    auth_reaction: {
        type: ReactionType
    },
    // Registration data
    registrationConfig?: EventRegistrationConfig
    userRegistration?: EventRegistration | null
    registeredCount?: number
    availableSpots?: number | null
    // readStatId: string
    // visitors    Visit[]
}
