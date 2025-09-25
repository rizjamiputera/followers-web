<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Visit Analytics</h1>
                <p class="text-gray-600">Comprehensive visitor and traffic analytics</p>
            </div>
            <div class="flex items-center gap-2">
                <!-- Time Period Selector -->
                <select v-model="selectedPeriod" class="select select-sm select-bordered">
                    <option :value="7">Last 7 days</option>
                    <option :value="30">Last 30 days</option>
                    <option :value="60">Last 60 days</option>
                    <option :value="90">Last 90 days</option>
                </select>
                <button @click="refreshAll" :disabled="loading" class="btn btn-sm btn-outline">
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

        <!-- Analytics Content -->
        <div v-else class="space-y-6">
            <!-- Main Metrics -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat v-if="visitAnalytics" :icon="LucideEye" color-class="text-primary" label="Total Visits"
                    :value1="formatNumber(visitAnalytics.visits.total)"
                    :value2="`${formatGrowthRate(visitAnalytics.visits.growthRate)} vs last month`" />

                <Stat v-if="visitAnalytics" :icon="LucideUsers" color-class="text-secondary" label="Unique Visitors"
                    :value1="formatNumber(visitAnalytics.uniqueVisitors.total)"
                    :value2="`${formatGrowthRate(visitAnalytics.uniqueVisitors.growthRate)} vs last month`" />

                <Stat v-if="visitAnalytics" :icon="LucideMousePointer" color-class="text-accent"
                    label="Avg Visits/Visitor" :value1="visitAnalytics.avgVisitsPerVisitor.toString()"
                    :value2="'Pages per session'" />

                <Stat v-if="visitorAnalytics" :icon="LucideUserPlus" color-class="text-info" label="New Visitors"
                    :value1="formatNumber(visitorAnalytics.demographics.newVisitors)"
                    :value2="`${Math.round((visitorAnalytics.demographics.newVisitors / visitorAnalytics.demographics.totalVisitors) * 100)}% of total`" />
            </div>

            <!-- Visit Timeline Chart -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="card-title flex items-center gap-2">
                            <LucideTrendingUp class="h-5 w-5" />
                            Visit Timeline
                        </h2>
                        <select v-model="timelineInterval" class="select select-sm select-bordered">
                            <option value="day">Daily</option>
                            <option value="week" v-if="selectedPeriod >= 30">Weekly</option>
                        </select>
                    </div>
                    <div class="h-64">
                        <!-- <VisitTimelineChart v-if="timelineData" :data="timelineData.timeline" /> -->
                        <LazyCpAnalyticsVisitTimelineChart v-if="timelineData" :data="timelineData.timeline" />
                        <div v-else class="flex items-center justify-center h-full text-gray-500">
                            <LucideBarChart3 class="h-8 w-8 mr-2" />
                            No timeline data available
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Visitor Demographics -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title flex items-center gap-2">
                            <LucideUsers class="h-5 w-5" />
                            Visitor Demographics
                        </h2>
                        <div v-if="visitorAnalytics" class="grid grid-cols-2 gap-4 mt-4">
                            <div class="stat">
                                <div class="stat-title">Total Visitors</div>
                                <div class="stat-value text-primary text-2xl">{{
                                    formatNumber(visitorAnalytics.demographics.totalVisitors) }}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Registered Users</div>
                                <div class="stat-value text-secondary text-2xl">{{
                                    formatNumber(visitorAnalytics.demographics.registeredUsers) }}</div>
                                <div class="stat-desc">{{ Math.round((visitorAnalytics.demographics.registeredUsers /
                                    visitorAnalytics.demographics.totalVisitors) * 100) }}% of visitors</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">New Visitors</div>
                                <div class="stat-value text-accent text-2xl">{{
                                    formatNumber(visitorAnalytics.demographics.newVisitors) }}</div>
                                <div class="stat-desc">{{ Math.round((visitorAnalytics.demographics.newVisitors /
                                    visitorAnalytics.demographics.totalVisitors) * 100) }}% of total</div>
                            </div>
                            <div class="stat">
                                <div class="stat-title">Returning</div>
                                <div class="stat-value text-info text-2xl">{{
                                    formatNumber(visitorAnalytics.demographics.returningVisitors) }}</div>
                                <div class="stat-desc">{{ Math.round((visitorAnalytics.demographics.returningVisitors /
                                    visitorAnalytics.demographics.totalVisitors) * 100) }}% of total</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Visit Comparison -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title flex items-center gap-2">
                            <LucideBarChart3 class="h-5 w-5" />
                            Period Comparison
                        </h2>
                        <div v-if="visitAnalytics" class="space-y-3 mt-4">
                            <!-- Today vs Yesterday -->
                            <div class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div>
                                    <div class="font-medium">Today</div>
                                    <div class="text-sm text-gray-600">{{ formatNumber(visitAnalytics.visits.today) }}
                                        visits</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm text-gray-600">Yesterday: {{
                                        formatNumber(visitAnalytics.visits.yesterday) }}</div>
                                    <div class="text-sm"
                                        :class="getGrowthColor(visitAnalytics.visits.today - visitAnalytics.visits.yesterday)">
                                        {{ formatChange(visitAnalytics.visits.today - visitAnalytics.visits.yesterday)
                                        }}
                                    </div>
                                </div>
                            </div>

                            <!-- This Week vs Last Week -->
                            <div class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div>
                                    <div class="font-medium">This Week</div>
                                    <div class="text-sm text-gray-600">{{ formatNumber(visitAnalytics.visits.thisWeek)
                                    }} visits</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm text-gray-600">Last Week: {{
                                        formatNumber(visitAnalytics.visits.lastWeek) }}</div>
                                    <div class="text-sm"
                                        :class="getGrowthColor(visitAnalytics.visits.thisWeek - visitAnalytics.visits.lastWeek)">
                                        {{ formatChange(visitAnalytics.visits.thisWeek - visitAnalytics.visits.lastWeek)
                                        }}
                                    </div>
                                </div>
                            </div>

                            <!-- This Month vs Last Month -->
                            <div class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div>
                                    <div class="font-medium">This Month</div>
                                    <div class="text-sm text-gray-600">{{ formatNumber(visitAnalytics.visits.thisMonth)
                                    }} visits</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm text-gray-600">Last Month: {{
                                        formatNumber(visitAnalytics.visits.lastMonth) }}</div>
                                    <div class="text-sm"
                                        :class="getGrowthColor(visitAnalytics.visits.thisMonth - visitAnalytics.visits.lastMonth)">
                                        {{ formatChange(visitAnalytics.visits.thisMonth -
                                            visitAnalytics.visits.lastMonth) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Pages -->
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <h2 class="card-title flex items-center gap-2">
                        <LucideFileText class="h-5 w-5" />
                        Top Pages
                    </h2>
                    <div v-if="topPages" class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    <th>Type</th>
                                    <th>Visits</th>
                                    <th>Unique Visitors</th>
                                    <th>Avg Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="page in topPages.pages.slice(0, 10)" :key="page.path">
                                    <td>
                                        <div class="max-w-xs">
                                            <div class="font-medium truncate">{{ page.title || page.path }}</div>
                                            <div class="text-sm text-gray-500 truncate">{{ page.path }}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge badge-sm"
                                            :class="{ 'badge-primary': page.contentType === 'article', 'badge-secondary': page.contentType === 'event', 'badge-ghost': !page.contentType }">
                                            {{ page.contentType || 'page' }}
                                        </span>
                                    </td>
                                    <td class="font-mono">{{ formatNumber(page.visits) }}</td>
                                    <td class="font-mono">{{ formatNumber(page.uniqueVisitors) }}</td>
                                    <td class="text-gray-500">{{ formatTime(page.avgTimeOnPage || 0) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Top Referrers -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title flex items-center gap-2">
                            <LucideExternalLink class="h-5 w-5" />
                            Top Referrers
                        </h2>
                        <div v-if="referrers" class="space-y-3 mt-4">
                            <!-- Direct Traffic -->
                            <div class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div>
                                    <div class="font-semibold">Direct Traffic</div>
                                    <div class="text-sm text-gray-600">Users who typed URL directly</div>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold">{{ formatNumber(referrers.directTraffic) }}</div>
                                    <div class="text-sm text-gray-600">visits</div>
                                </div>
                            </div>

                            <!-- Top Referrers -->
                            <div v-for="referrer in referrers.referrers.slice(0, 5)" :key="referrer.referrer"
                                class="flex items-center justify-between p-3 bg-base-200 rounded">
                                <div class="flex-1">
                                    <div class="font-semibold truncate">{{ getDomainFromUrl(referrer.referrer) }}</div>
                                    <div class="text-sm text-gray-600 truncate">{{ referrer.referrer }}</div>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold">{{ formatNumber(referrer.visits) }}</div>
                                    <div class="text-sm text-gray-600">{{ referrer.percentage.toFixed(1) }}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Agent Analytics -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <h2 class="card-title flex items-center gap-2">
                            <LucideMonitor class="h-5 w-5" />
                            Browser & Device Analytics
                        </h2>
                        <div v-if="userAgentAnalytics" class="space-y-4 mt-4">
                            <!-- Top Browsers -->
                            <div>
                                <h3 class="font-semibold mb-2">Top Browsers</h3>
                                <div class="space-y-2">
                                    <div v-for="browser in userAgentAnalytics.browsers.slice(0, 5)" :key="browser.name"
                                        class="flex items-center justify-between">
                                        <span class="text-sm">{{ browser.name }}</span>
                                        <div class="flex items-center gap-2">
                                            <div class="w-20 bg-base-300 rounded-full h-2">
                                                <div class="bg-primary h-2 rounded-full"
                                                    :style="{ width: browser.percentage + '%' }"></div>
                                            </div>
                                            <span class="text-sm font-mono w-12 text-right">
                                                {{ browser.percentage.toFixed(1) }}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Top Devices -->
                            <div>
                                <h3 class="font-semibold mb-2">Device Types</h3>
                                <div class="space-y-2">
                                    <div v-for="device in userAgentAnalytics.devices.slice(0, 5)" :key="device.name"
                                        class="flex items-center justify-between">
                                        <span class="text-sm">{{ device.name }}</span>
                                        <div class="flex items-center gap-2">
                                            <div class="w-20 bg-base-300 rounded-full h-2">
                                                <div class="bg-secondary h-2 rounded-full"
                                                    :style="{ width: device.percentage + '%' }"></div>
                                            </div>
                                            <span class="text-sm font-mono w-12 text-right">{{
                                                device.percentage.toFixed(1) }}%</span>
                                        </div>
                                    </div>
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
    LucideEye,
    LucideUsers,
    LucideMousePointer,
    LucideUserPlus,
    LucideTrendingUp,
    LucideBarChart3,
    LucideFileText,
    LucideExternalLink,
    LucideMonitor
} from 'lucide-vue-next'
// import VisitTimelineChart from '~/components/cp/analytics/VisitTimelineChart.vue'
import Stat from '~/components/cp/dashboard/stat.vue'
// import VisitTimelineChart from '~/components/cp/analytics/VisitTimelineChart.vue'

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore()
            if (!auth.isSuperOrAdmin) {
                throw createError({ statusCode: 403, statusMessage: 'Access denied' })
            }
        }
    ]
})

// Store
const visitAnalyticsStore = useVisitAnalyticsStore()

// Reactive data from store
const {
    visitAnalytics,
    visitorAnalytics,
    topPages,
    timeline: timelineData,
    referrers,
    userAgentAnalytics,
    selectedPeriod,
    timelineInterval,
    isAnyLoading: loading,
    isError,
    errorMessage
} = storeToRefs(visitAnalyticsStore)

// Computed for error message
const error = computed(() => isError.value ? errorMessage.value : null)

// Methods
const loadAllAnalytics = async () => {
    await visitAnalyticsStore.fetchAllAnalytics()
}

const refreshTimeline = async () => {
    await visitAnalyticsStore.fetchTimeline()
}

const refreshAll = () => {
    visitAnalyticsStore.fetchAllAnalytics()
}

// Utility functions

const formatGrowthRate = (rate: number): string => {
    const sign = rate >= 0 ? '+' : ''
    return `${sign}${rate.toFixed(1)}%`
}

const formatChange = (change: number): string => {
    if (change === 0) return '±0'
    const sign = change > 0 ? '+' : ''
    return `${sign}${change}`
}

const getGrowthColor = (change: number): string => {
    if (change > 0) return 'text-success'
    if (change < 0) return 'text-error'
    return 'text-gray-500'
}

const formatTime = (seconds: number): string => {
    if (seconds === 0) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getDomainFromUrl = (url: string): string => {
    try {
        return new URL(url).hostname
    } catch {
        return url
    }
}

// Watch for period changes
watch(selectedPeriod, async (newPeriod) => {
    if (timelineInterval.value === 'week' && newPeriod < 30) {
        visitAnalyticsStore.timelineInterval = 'day'
    }
    await visitAnalyticsStore.setPeriod(newPeriod)
})

watch(timelineInterval, async (newInterval) => {
    await visitAnalyticsStore.setTimelineInterval(newInterval)
})

// Load data on mount
onMounted(() => {
    visitAnalyticsStore.fetchAllAnalytics()
})

// SEO
useSeoMeta({
    title: 'Visit Analytics - Control Panel',
    description: 'Comprehensive visitor and traffic analytics dashboard'
})
</script>

<style scoped>
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
