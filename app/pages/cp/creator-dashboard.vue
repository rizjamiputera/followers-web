<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
                <p class="text-gray-600">Your content performance and statistics</p>
            </div>
            <div class="flex items-center gap-2">
                <button @click="refreshData" :disabled="loading" class="btn btn-sm btn-outline">
                    <LucideRefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
                    Refresh
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error">
            <LucideAlertCircle class="h-4 w-4" />
            <span>{{ error }}</span>
        </div>

        <!-- Creator Dashboard Content -->
        <div v-else-if="creatorData" class="space-y-6">
            <!-- Personal Overview -->
            <div class="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow">
                <div class="card-body">
                    <div class="flex items-center gap-4">
                        <Avatar v-if="user" :avatar="user.avatar_md" :name="user.name" class="w-20 h-20" />
                        <div>
                            <h2 class="text-2xl font-bold">{{ creatorData.user?.name || 'User' }}</h2>
                            <p class="text-gray-600">{{ creatorData.user?.role || 'USER' }}</p>
                            <p class="text-gray-600">{{ creatorData.user?.email || 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Statistics -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Total Content -->
                <Stat :icon="LucideFileText" color-class="text-primary" label="Total Content"
                    :value1="formatNumber(totalContent)" :value2="`${formatNumber(creatorData.statistics?.content?.articles?.total || 0)} articles,
                        ${formatNumber(creatorData.statistics?.content?.events?.total || 0)} events`" />

                <!-- Total Views -->
                <Stat :icon="LucideFileText" color-class="text-secondary" label="Total Views"
                    :value1="formatNumber(creatorData.statistics?.engagement?.totalViews || 0)"
                    value2="Across all your content" />

                <!-- Engagement -->
                <Stat :icon="LucideHeart" color-class="text-accent" label="Total Likes"
                    :value1="formatNumber(creatorData.statistics?.engagement?.totalLikes || 0)"
                    :value2="`${formatNumber(creatorData.statistics?.engagement?.totalComments || 0)} comments`" />

                <!-- Rating -->
                <!-- <Stat :icon="LucideStar" color-class="text-info" label="Average Rating"
                    :value1="(creatorData.statistics?.engagement?.averageRating || 0).toFixed(1)"
                    :value2="`${formatNumber(creatorData.statistics?.social?.ratingsCount || 0)} ratings`" /> -->
            </div>

            <!-- Content Visitor Analytics -->
            <div class="card bg-base-100 shadow">
                <div class="card-body max-sm:p-4">
                    <h2 class="card-title flex items-center gap-2">
                        <LucideEye class="h-5 w-5" />
                        Content Visitor Analytics
                    </h2>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <!-- All Time -->
                        <Stat :icon="LucideGlobe" color-class="text-primary" label="All Time"
                            :value1="formatNumber(creatorData.statistics?.visitors?.total || 0)"
                            value2="Total content visits" />


                        <!-- This Year -->
                        <Stat :icon="LucideCalendar" color-class="text-secondary" label="This Year"
                            :value1="formatNumber(creatorData.statistics?.visitors?.thisYear || 0)"
                            value2="Content visits this year" />

                        <!-- This Month -->
                        <Stat :icon="LucideCalendarDays" color-class="text-accent" label="This Month"
                            :value1="formatNumber(creatorData.statistics?.visitors?.thisMonth || 0)"
                            value2="Content visits this month" />

                        <Stat :icon="LucideCalendarCheck" color-class="text-info" label="Today"
                            :value1="formatNumber(creatorData.statistics?.visitors?.today || 0)"
                            value2="Content visits today" />
                    </div>
                </div>
            </div>

            <!-- Content Status Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- My Articles Status -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">My Articles</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="stat">
                                <div class="stat-title">Published</div>
                                <div class="stat-value text-success text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.articles?.published || 0) }}
                                </div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Draft</div>
                                <div class="stat-value text-warning text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.articles?.draft || 0) }}
                                </div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Under Review</div>
                                <div class="stat-value text-info text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.articles?.on_review || 0) }}
                                </div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Approved</div>
                                <div class="stat-value text-primary text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.articles?.approved || 0) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- My Events Status -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">My Events</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="stat">
                                <div class="stat-title">Published</div>
                                <div class="stat-value text-success text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.events?.published || 0) }}
                                </div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Draft</div>
                                <div class="stat-value text-warning text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.events?.draft || 0) }}
                                </div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Under Review</div>
                                <div class="stat-value text-info text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.events?.on_review || 0) }}
                                </div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Approved</div>
                                <div class="stat-value text-primary text-2xl">{{
                                    formatNumber(creatorData.statistics?.content?.events?.approved || 0) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Metrics -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Social Stats -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Social</h2>
                        <div class="space-y-4">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Followers</span>
                                <span class="font-bold">
                                    {{ formatNumber(creatorData.statistics?.social?.followers || 0) }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Total Shares</span>
                                <span class="font-bold">
                                    {{ formatNumber(creatorData.statistics?.engagement?.totalShares || 0) }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Bookmarks</span>
                                <span class="font-bold">{{
                                    formatNumber(creatorData.statistics?.engagement?.totalBookmarks || 0) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Event Metrics -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Event Engagement</h2>
                        <div class="space-y-4">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Total Registrations</span>
                                <span class="font-bold">
                                    {{ formatNumber(creatorData.statistics?.engagement?.totalEventRegistrations || 0) }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Avg. per Event</span>
                                <span class="font-bold">{{ formatNumber(averageRegistrationsPerEvent) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Quick Actions</h2>
                        <div class="space-y-2">
                            <NuxtLink v-if="can(Module.ARTICLE, Permission.CREATE)" to="/cp/my-articles/form"
                                class="btn btn-sm btn-primary w-full">
                                <LucidePlus class="h-4 w-4" />
                                New Article
                            </NuxtLink>
                            <NuxtLink v-if="can(Module.EVENT, Permission.CREATE)" to="/cp/my-events/form"
                                class="btn btn-sm btn-secondary w-full">
                                <LucidePlus class="h-4 w-4" />
                                New Event
                            </NuxtLink>
                            <NuxtLink v-if="can(Module.ARTICLE, Permission.CREATE)" to="/cp/my-articles"
                                class="btn btn-sm btn-outline w-full">
                                <LucideFileText class="h-4 w-4" />
                                Manage Articles
                            </NuxtLink>
                            <NuxtLink v-if="can(Module.EVENT, Permission.CREATE)" to="/cp/my-events"
                                class="btn btn-sm btn-outline w-full">
                                <LucideCalendar class="h-4 w-4" />
                                Manage Events
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Performing Articles -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Top Articles by Performance -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Top Articles by Views</h2>
                        <div class="space-y-3">
                            <div v-for="article in (creatorData.statistics?.performance?.articles || []).slice(0, 5)"
                                :key="article.id" class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div class="flex-1">
                                    <div class="font-medium line-clamp-1">{{ article.title }}</div>
                                    <div class="text-sm text-gray-600">{{ formatDate(article.publishedAt) }}</div>
                                </div>
                                <div class="text-sm font-bold text-primary">
                                    {{ formatNumber(article.metrics?.readCount || 0) }} views
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Events by Registration -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Top Events by Registration</h2>
                        <div class="space-y-3">
                            <div v-for="event in (creatorData.statistics?.performance?.events || []).slice(0, 5)"
                                :key="event.id" class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div class="flex-1">
                                    <div class="font-medium line-clamp-1">{{ event.title }}</div>
                                    <div class="text-sm text-gray-600">{{ formatDate(event.publishedAt) }}</div>
                                </div>
                                <div class="text-sm font-bold text-secondary">
                                    {{ formatNumber(event.registrations || 0) }} registered
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    LucideRefreshCw,
    LucideAlertCircle,
    LucideFileText,
    LucideEye,
    LucideHeart,
    LucideStar,
    LucidePlus,
    LucideCalendar,
    LucideCalendarCheck,
    LucideCalendarDays,
    LucideGlobe
} from 'lucide-vue-next'
import Stat from '~/components/cp/dashboard/stat.vue';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel'
})

const AuthStore = useAuthStore();

const { user, can } = storeToRefs(AuthStore);

// Reactive data
const creatorData = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed
const totalContent = computed(() => {
    if (!creatorData.value) return 0
    return (creatorData.value.statistics?.content?.articles?.total || 0) + (creatorData.value.statistics?.content?.events?.total || 0)
})

const averageRegistrationsPerEvent = computed(() => {
    if (!creatorData.value || (creatorData.value.statistics?.content?.events?.total || 0) === 0) return 0
    return Math.round((creatorData.value.statistics?.engagement?.totalEventRegistrations || 0) / (creatorData.value.statistics?.content?.events?.total || 1))
})

// Methods
const loadCreatorDashboard = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await Api.get('/v1/dashboard/creator-dashboard') as any
        creatorData.value = response.data
    } catch (err: any) {
        console.error('Failed to load creator dashboard data:', err)
        if (err.response?.status === 403) {
            error.value = 'Forbidden: You do not have permission to access this dashboard'
        } else {
            error.value = 'Failed to load dashboard data'
        }
    } finally {
        loading.value = false
    }
}

const refreshData = () => {
    loadCreatorDashboard()
}

const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

// Load creator dashboard data on mount
onMounted(() => {
    loadCreatorDashboard()
})

// SEO
useSeoMeta({
    title: 'Creator Dashboard - Control Panel',
    description: 'Your content performance and creator statistics'
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
