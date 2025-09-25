<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p class="text-gray-600">Platform overview and statistics</p>
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

        <!-- Dashboard Content -->
        <div v-else-if="dashboardData" class="space-y-6">
            <!-- Overview Statistics -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat :icon="LucideUsers" color-class="text-primary" label="Total Visitors"
                    :value1="formatNumber(dashboardData.overview.visitors.total)"
                    :value2="`${formatNumber(dashboardData.overview.visitors.visitsLast24Hours)} visits last 24h`" />

                <Stat :icon="LucideFileText" color-class="text-secondary" label="Total Content"
                    :value1="formatNumber(totalContent)"
                    :value2="`${formatNumber(dashboardData.overview.content.articles.total)} articles, ${formatNumber(dashboardData.overview.content.events.total)} events`" />

                <Stat :icon="LucideUserCheck" color-class="text-accent" label="Platform Users"
                    :value1="formatNumber(dashboardData.overview.users.total)"
                    :value2="`${formatNumber(dashboardData.overview.recentActivity.newUsers)} new this week`" />

                <Stat :icon="LucideUserPlus" color-class="text-info" label="New Registrations"
                    :value1="formatNumber(dashboardData.overview.recentActivity.newUsers)"
                    value2="This week's growth" />
            </div>

            <!-- Visitor Analytics -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h2 class="card-title flex items-center gap-2">
                        <LucideUsers class="h-5 w-5" />
                        Visitor Analytics
                    </h2>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <!-- All Time -->
                        <Stat :icon="LucideGlobe" color-class="text-primary" label="All Time Visitor"
                            :value1="formatNumber(dashboardData.overview.visitors?.total || 0)"
                            :value2="`${formatNumber(dashboardData.overview.visitors?.totalVisits || 0)} visits`" />
                        <!-- value2="Total visitors" /> -->

                        <!-- This Year -->
                        <Stat :icon="LucideCalendar" color-class="text-secondary" label="This Year Visitor"
                            :value1="formatNumber(dashboardData.overview.visitors?.thisYear?.visitors || 0)"
                            :value2="`${formatNumber(dashboardData.overview.visitors?.thisYear?.visits || 0)} visits`" />

                        <!-- This Month -->
                        <Stat :icon="LucideCalendarDays" color-class="text-accent" label="This Month Visitor"
                            :value1="formatNumber(dashboardData.overview.visitors?.thisMonth?.visitors || 0)"
                            :value2="`${formatNumber(dashboardData.overview.visitors?.thisMonth?.visits || 0)} visits`" />

                        <!-- Today -->
                        <Stat :icon="LucideCalendarCheck" color-class="text-info" label="Today Visitor"
                            :value1="formatNumber(dashboardData.overview.visitors?.today?.visitors || 0)"
                            :value2="`${formatNumber(dashboardData.overview.visitors?.today?.visits || 0)} visits`" />
                    </div>
                </div>
            </div>

            <!-- Platform Engagement -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h2 class="card-title flex items-center gap-2">
                        <LucideHeart class="h-5 w-5" />
                        Platform Engagement
                    </h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                        <Engagement :icon="LucideHeart" label="Total Reactions"
                            :value="formatNumber(dashboardData.overview.engagement.totalReactions)" />

                        <Engagement :icon="LucideMessageCircle" label="Comments"
                            :value="formatNumber(dashboardData.overview.engagement.totalComments)" />

                        <Engagement :icon="LucideBookmark" label="Bookmarks"
                            :value="formatNumber(dashboardData.overview.engagement.totalBookmarks)" />

                        <Engagement :icon="LucideCalendarCheck" label="Event Registrations"
                            :value="formatNumber(dashboardData.overview.engagement.totalEventRegistrations)" />

                        <Engagement :icon="LucideActivity" label="Total Activity"
                            :value="formatNumber(totalEngagement)" />
                    </div>
                </div>
            </div>

            <!-- Content Status Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Articles Status -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Articles by Status</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="stat">
                                <div class="stat-title">Published</div>
                                <div class="stat-value text-success text-2xl">{{
                                    formatNumber(dashboardData.overview.content.articles.published || 0) }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Draft</div>
                                <div class="stat-value text-warning text-2xl">{{
                                    formatNumber(dashboardData.overview.content.articles.draft || 0) }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Under Review</div>
                                <div class="stat-value text-info text-2xl">{{
                                    formatNumber(dashboardData.overview.content.articles.on_review || 0) }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Featured</div>
                                <div class="stat-value text-primary text-2xl">{{
                                    formatNumber(dashboardData.overview.content.featured.articles) }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Events Status -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Events by Status</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="stat">
                                <div class="stat-title">Published</div>
                                <div class="stat-value text-success text-2xl">{{
                                    formatNumber(dashboardData.overview.content.events.published || 0) }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Draft</div>
                                <div class="stat-value text-warning text-2xl">{{
                                    formatNumber(dashboardData.overview.content.events.draft || 0) }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Under Review</div>
                                <div class="stat-value text-info text-2xl">{{
                                    formatNumber(dashboardData.overview.content.events.on_review || 0) }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Featured</div>
                                <div class="stat-value text-primary text-2xl">{{
                                    formatNumber(dashboardData.overview.content.featured.events) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Performing Content -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Top Articles -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Top Articles by Views</h2>
                        <div class="space-y-3">
                            <div v-for="article in dashboardData.topContent.topArticlesByViews.slice(0, 5)"
                                :key="article.id" class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div class="flex-1">
                                    <div class="font-medium line-clamp-1">{{ article.title }}</div>
                                    <div class="text-sm text-gray-600">by {{ article.author.name }}</div>
                                </div>
                                <div class="text-sm font-bold text-primary">{{ formatNumber(article.stats.readCount) }}
                                    views</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Events -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title">Top Events by Registrations</h2>
                        <div class="space-y-3">
                            <div v-for="event in dashboardData.topContent.topEventsByRegistrations.slice(0, 5)"
                                :key="event.id" class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div class="flex-1">
                                    <div class="font-medium line-clamp-1">{{ event.title }}</div>
                                    <div class="text-sm text-gray-600">by {{ event.author.name }}</div>
                                </div>
                                <div class="text-sm font-bold text-secondary">
                                    {{ formatNumber(event.registrationCount) }} registered
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity Timeline -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h2 class="card-title">Recent Activity</h2>
                    <div class="space-y-3">
                        <div v-for="activity in dashboardData.recentActivity.slice(0, 10)"
                            :key="`${activity.type}-${activity.title}`" class="p-3 bg-base-200 rounded">
                            <!-- <div class="avatar placeholder">
                                <div class="bg-neutral text-neutral-content rounded-full w-8">
                                    <LucideFileText v-if="activity.type === 'article'" class="h-4 w-4" />
                                    <LucideCalendar v-else-if="activity.type === 'event'" class="h-4 w-4" />
                                    <LucideUser v-else class="h-4 w-4" />
                                </div>
                            </div>
                            <div class="flex-1"> -->
                            <div class="font-medium">{{ activity.title }}</div>
                            <div class="text-sm text-gray-600">
                                {{ activity.action }} by {{ activity.author || 'System' }}
                                <span class="text-gray-500">• {{ formatDate(activity.createdAt) }}</span>
                            </div>
                            <!-- </div> -->
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
    LucideUsers,
    LucideFileText,
    LucideUserCheck,
    LucideUserPlus,
    LucideHeart,
    LucideMessageCircle,
    LucideBookmark,
    LucideCalendarCheck,
    LucideCalendarDays,
    LucideActivity,
    LucideCalendar,
    LucideUser,
    LucideGlobe
} from 'lucide-vue-next'
import Stat from '~/components/cp/dashboard/stat.vue'
import Engagement from '~/components/cp/dashboard/engagement.vue'
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.isSuperOrAdmin) {
                if (auth.can(Module.ARTICLE, Permission.CREATE) || auth.can(Module.EVENT, Permission.CREATE)) {
                    return navigateTo('/cp/creator-dashboard')
                }
            }
        }
    ]
})

// Reactive data
const dashboardData = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed
const totalContent = computed(() => {
    if (!dashboardData.value) return 0
    return dashboardData.value.overview.content.articles.total + dashboardData.value.overview.content.events.total
})

const totalEngagement = computed(() => {
    if (!dashboardData.value) return 0
    const engagement = dashboardData.value.overview.engagement
    return (engagement.totalReactions || 0) +
        (engagement.totalComments || 0) +
        (engagement.totalBookmarks || 0) +
        (engagement.totalEventRegistrations || 0)
})

// Methods
const loadDashboard = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await Api.get('/v1/dashboard/admin-overview') as any
        dashboardData.value = response.data
    } catch (err: any) {
        // console.error('Failed to load dashboard data:', err)
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
    loadDashboard()
}

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Load dashboard data on mount
onMounted(() => {
    loadDashboard()
})

// SEO
useSeoMeta({
    title: 'Dashboard - Control Panel',
    description: 'Platform statistics and analytics dashboard'
})
</script>

<style scoped>
/* .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
} */
</style>
