export interface Category {
    id: string
    name: string
    slug: string
    description?: string | null
    sortOrder: number
    showOnHome: boolean
    createdAt: string
    updatedAt: string
    _count?: {
        articles: number
        events: number
    }
}
