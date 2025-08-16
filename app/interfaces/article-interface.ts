import type { User } from "./user-interface"

export interface Article {
    id: string
    slug: string
    title: string
    excerpt: string
    image: string
    image_sm: string
    content?: ArticleContent
    // contentId   :string
    // versions    ArticleContentVersion[]
    // isFeatured  Boolean                 @default(false)
    // status      ArticleStatus           @default(DRAFT)
    publishedAt?: string // actual publish time
    author?: User
    authorId: string
    // approvals   ArticleApproval[]
    tags?: Tag[]
    // comments?: Comment[]
    // reactions   ArticleReaction[]
    // createdAt   DateTime @default (now())
    // updatedAt   DateTime @updatedAt
    // deleted     Boolean @default (false)
    // readStat    ArticleReadStat @relation(fields: [readStatId], references: [id], onDelete: Restrict)
    // readStatId: string
    // visitors    Visit[]
}

export interface ArticleContent {
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
