export interface ContentSortOption {
    key: string
    label: string
    sortBy: string
    order: 'asc' | 'desc'
}

// Sort presets for the CP content lists. sortBy uses dot-paths that the API's
// nestedOrderBy resolves (e.g. "stats.commentCount" -> { stats: { commentCount } }).
export const CONTENT_SORT_OPTIONS: ContentSortOption[] = [
    { key: 'newest', label: 'Terbaru', sortBy: 'createdAt', order: 'desc' },
    { key: 'oldest', label: 'Terlama', sortBy: 'createdAt', order: 'asc' },
    { key: 'published', label: 'Terakhir dipublish', sortBy: 'publishedAt', order: 'desc' },
    { key: 'popular', label: 'Paling banyak dibaca', sortBy: 'stats.readCount', order: 'desc' },
    { key: 'comments', label: 'Komentar terbanyak', sortBy: 'stats.commentCount', order: 'desc' },
    { key: 'likes', label: 'Paling disukai', sortBy: 'stats.likeCount', order: 'desc' },
    { key: 'bookmarks', label: 'Paling banyak disimpan', sortBy: 'stats.bookmarkCount', order: 'desc' },
]

export const resolveContentSort = (key?: string): ContentSortOption =>
    CONTENT_SORT_OPTIONS.find((o) => o.key === key) ?? CONTENT_SORT_OPTIONS[0]!
