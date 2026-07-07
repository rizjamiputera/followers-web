import type { User } from './user-interface'

export interface SpeakerContentArticle {
    id: string
    slug: string
    title: string
    excerpt: string
    image?: string
    image_md?: string
    publishedAt?: string
}

export interface SpeakerContentEvent {
    id: string
    slug: string
    title: string
    excerpt: string
    image?: string
    image_md?: string
    start_at?: string
}

export interface SpeakerContent {
    role?: string | null
    article?: SpeakerContentArticle | null
    event?: SpeakerContentEvent | null
}

export interface Speaker {
    id: string
    slug: string
    name: string
    honorific?: string | null
    credentials?: string | null
    suffix?: string | null
    bio?: string | null
    avatar?: string | null
    avatar_md?: string | null
    verified: boolean
    userId?: string | null
    user?: Pick<User, 'id' | 'username' | 'name' | 'avatar' | 'avatar_md'> | null
    contents?: SpeakerContent[]
    _count?: { contents: number }
}
