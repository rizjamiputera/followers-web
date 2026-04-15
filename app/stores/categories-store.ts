import { defineStore } from 'pinia'
import type { Category } from '~/interfaces/category-interface'

interface State {
    categories: Category[]
    loaded: boolean
}

export const useCategoriesStore = defineStore('categories', {
    state: (): State => ({
        categories: [],
        loaded: false,
    }),
    getters: {
        // Hide "Umum" from navigation if it has no published content.
        navCategories: (state): Category[] => {
            return state.categories
                .filter(c => {
                    if (c.slug !== 'umum') return true
                    return (c._count?.articles ?? 0) + (c._count?.events ?? 0) > 0
                })
                .sort((a, b) => a.sortOrder - b.sortOrder)
        },
        // Categories marked as "show on home" (admin-toggled). Used by
        // the homepage to render one section per category below latest.
        homeCategories: (state): Category[] => {
            return state.categories
                .filter(c => c.showOnHome)
                .filter(c => (c._count?.articles ?? 0) > 0)
                .sort((a, b) => a.sortOrder - b.sortOrder)
        },
    },
    actions: {
        async fetch() {
            try {
                const list = (await Api.get('/v1/categories')) as Category[]
                this.categories = Array.isArray(list) ? list : []
                this.loaded = true
            } catch (err) {
                console.error('Failed to load categories:', err)
                this.categories = []
            }
        },
        findBySlug(slug: string): Category | undefined {
            return this.categories.find(c => c.slug === slug)
        },
    },
})
