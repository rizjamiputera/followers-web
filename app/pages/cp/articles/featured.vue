<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Featured Articles</h1>
                <p class="text-gray-600">Manage articles that appear in the featured carousel on homepage</p>
            </div>
        </div>

        <!-- Stats -->
        <div class="stats shadow w-full">
            <div class="stat">
                <div class="stat-title">Featured Articles</div>
                <div class="stat-value text-primary">{{articles.filter(a => a.isFeatured).length}}</div>
                <div class="stat-desc">Currently featured</div>
            </div>
            <div class="stat">
                <div class="stat-title">Total Published</div>
                <div class="stat-value">{{ articles.length }}</div>
                <div class="stat-desc">Published articles</div>
            </div>
        </div>

        <!-- Articles List -->
        <div class="card cp-surface shadow">
            <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="card-title">Published Articles</h2>
                    <div class="flex items-center gap-2">
                        <div class="form-control">
                            <input v-model="searchQuery" type="text" placeholder="Search articles..."
                                class="input input-bordered input-sm w-64" />
                        </div>
                        <div class="form-control">
                            <select v-model="filterFeatured" class="select select-bordered select-sm">
                                <option value="">All Articles</option>
                                <option value="true">Featured Only</option>
                                <option value="false">Not Featured</option>
                            </select>
                        </div>
                        <button @click="loadArticles" class="btn btn-sm btn-outline">
                            <LucideRefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
                        </button>
                    </div>
                </div>

                <div v-if="loading" class="flex justify-center py-8">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>

                <div v-else-if="filteredArticles.length === 0" class="text-center py-8 text-gray-500">
                    <LucideFileText class="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No articles found</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>Article</th>
                                <th>Author</th>
                                <th>Published</th>
                                <th>Stats</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="article in paginatedArticles" :key="article.id">
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div class="avatar">
                                            <div class="mask mask-squircle w-12 h-12">
                                                <img v-if="article.image" :src="article.image" :alt="article.title" />
                                                <div v-else
                                                    class="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center">
                                                    <LucideFileText class="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-semibold line-clamp-1">{{ article.title }}</div>
                                            <div class="text-sm opacity-70 line-clamp-1">{{ article.excerpt }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <Avatar :avatar="article.author?.avatar_md" :name="article.author?.name"
                                            class="w-6 h-6 shrink-0" />
                                        <span class="text-sm text-gray-700 text-nowrap">{{ article.author?.name }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="text-sm">{{ formatDate(article.publishedAt) }}</div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-4 text-xs">
                                        <div class="flex items-center gap-1">
                                            <LucideEye class="h-3 w-3" />
                                            <span>{{ article.stats?.visitCount || 0 }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <LucideHeart class="h-3 w-3" />
                                            <span>{{ article.stats?.likeCount || 0 }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <input type="checkbox" :checked="article.isFeatured"
                                                @change="toggleFeatured(article)" :disabled="updating"
                                                class="checkbox checkbox-primary checkbox-sm" />
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <NuxtLink :to="`/read/${article.slug}`" target="_blank"
                                            class="btn btn-ghost btn-xs">
                                            <LucideExternalLink class="h-4 w-4" />
                                        </NuxtLink>
                                        <NuxtLink :to="`/cp/my-articles/form?id=${article.id}`"
                                            class="btn btn-ghost btn-xs">
                                            <LucideEdit class="h-4 w-4" />
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center mt-6">
                    <div class="join">
                        <button v-for="page in paginationRange" :key="page" @click="currentPage = page"
                            class="join-item btn btn-sm" :class="{ 'btn-active': page === currentPage }">
                            {{ page }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    LucideRefreshCw,
    LucideFileText,
    LucideEye,
    LucideHeart,
    LucideExternalLink,
    LucideEdit
} from 'lucide-vue-next'
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.ARTICLE, Permission.READ)) {
                return navigateTo('/cp')
            }
        }
    ]
})

// Reactive data
const articles = ref<any[]>([])
const loading = ref(false)
const updating = ref(false)
const searchQuery = ref('')
const filterFeatured = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredArticles = computed(() => {
    let filtered = articles.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query) ||
            article.author?.name.toLowerCase().includes(query)
        )
    }

    if (filterFeatured.value !== '') {
        const isFeatured = filterFeatured.value === 'true'
        filtered = filtered.filter(article => article.isFeatured === isFeatured)
    }

    return filtered
})

const totalPages = computed(() => {
    return Math.ceil(filteredArticles.value.length / itemsPerPage)
})

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredArticles.value.slice(start, end)
})

const paginationRange = computed(() => {
    const range = []
    const total = totalPages.value
    const current = currentPage.value

    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        range.push(i)
    }

    return range
})

// Methods
const loadArticles = async () => {
    loading.value = true
    try {
        const response = await Api.get('/v1/article?status=PUBLISHED&limit=1000&includes=author,stats') as any
        articles.value = response.data || []
    } catch (error) {
        console.error('Failed to load articles:', error)
        // Add toast notification here if available
    } finally {
        loading.value = false
    }
}

const toggleFeatured = async (article: any) => {
    updating.value = true
    try {
        await Api.patch(`/v1/home-page/featured-articles/${article.id}`, {
            isFeatured: !article.isFeatured
        })

        // Update local state
        article.isFeatured = !article.isFeatured

        // Show success message
        // Add toast notification here if available

    } catch (error) {
        console.error('Failed to update featured status:', error)
        // Add error toast here if available
    } finally {
        updating.value = false
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// Load articles on mount
onMounted(() => {
    loadArticles()
})

// SEO
useSeoMeta({
    title: 'Featured Articles - Control Panel',
    description: 'Manage featured articles for homepage carousel'
})
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
