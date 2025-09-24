<template>
    <div class="w-full h-screen flex flex-col">
        <!-- Header -->
        <div class="bg-base-100 border-b border-base-300 px-6 py-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Visitor Journey Analytics</h1>
                    <p class="text-base-content/60 text-sm mt-1">Track visitor paths and behavior patterns using
                        fingerprint analytics</p>
                </div>

                <!-- Period Selector -->
                <div class="flex items-center gap-3">
                    <label class="text-sm font-medium">Period:</label>
                    <select v-model="selectedPeriod" class="select select-sm select-bordered"
                        @change="handlePeriodChange" :disabled="isAnyLoading">
                        <option :value="7">Last 7 days</option>
                        <option :value="30">Last 30 days</option>
                        <option :value="90">Last 90 days</option>
                    </select>

                    <button @click="refreshData" class="btn btn-sm btn-primary" :class="{ 'loading': isAnyLoading }"
                        :disabled="isAnyLoading">
                        <LucideRefreshCw :size="16" />
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden">
            <div class="h-full overflow-y-auto p-6">
                <!-- Loading State -->
                <div v-if="isLoading && !hasJourneyData" class="flex justify-center items-center h-96">
                    <div class="loading loading-spinner loading-lg"></div>
                </div>

                <!-- Error State -->
                <div v-else-if="isError" class="alert alert-error">
                    <LucideAlertCircle :size="20" />
                    <span>{{ errorMessage }}</span>
                    <button @click="refreshData" class="btn btn-sm btn-outline">
                        Try Again
                    </button>
                </div>

                <!-- Main Content -->
                <div v-else class="space-y-6">
                    <!-- Summary Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Total Visitors -->
                        <div class="stats shadow-sm bg-base-100">
                            <div class="stat">
                                <div class="stat-figure text-primary">
                                    <LucideUsers :size="24" />
                                </div>
                                <div class="stat-title">Tracked Visitors</div>
                                <div class="stat-value text-primary">
                                    {{ formatNumber(entryExitPages?.totalUniqueVisitors ?? 0) }}
                                </div>
                                <div class="stat-desc">with fingerprint tracking</div>
                            </div>
                        </div>

                        <!-- Total Journeys -->
                        <div class="stats shadow-sm bg-base-100">
                            <div class="stat">
                                <div class="stat-figure text-secondary">
                                    <LucideRoute :size="24" />
                                </div>
                                <div class="stat-title">Journey Sessions</div>
                                <div class="stat-value text-secondary">
                                    {{ formatNumber(visitorJourneys?.totalJourneys ?? 0) }}
                                </div>
                                <div class="stat-desc">complete visitor paths</div>
                            </div>
                        </div>

                        <!-- Path Transitions -->
                        <div class="stats shadow-sm bg-base-100">
                            <div class="stat">
                                <div class="stat-figure text-accent">
                                    <LucideArrowRightLeft :size="24" />
                                </div>
                                <div class="stat-title">Path Transitions</div>
                                <div class="stat-value text-accent">
                                    {{ formatNumber(pathFlow?.totalTransitions ?? 0) }}
                                </div>
                                <div class="stat-desc">page-to-page flows</div>
                            </div>
                        </div>

                        <!-- Conversion Funnels -->
                        <div class="stats shadow-sm bg-base-100">
                            <div class="stat">
                                <div class="stat-figure text-success">
                                    <LucideTrendingUp :size="24" />
                                </div>
                                <div class="stat-title">Funnels</div>
                                <div class="stat-value text-success">
                                    {{ visitorFunnels?.funnels.length ?? 0 }}
                                </div>
                                <div class="stat-desc">user journey flows</div>
                            </div>
                        </div>
                    </div>

                    <!-- Visitor Funnels -->
                    <div class="card bg-base-100 shadow-sm">
                        <div
                            class="bg-base-200 px-6 py-4 rounded-t-lg border-b border-base-300 flex justify-between items-center">
                            <h2 class="card-title">
                                <LucideTrendingUp :size="20" />
                                Visitor Conversion Funnels
                            </h2>
                        </div>
                        <div class="card-body">
                            <div v-if="isLoadingFunnels" class="flex justify-center py-12">
                                <div class="loading loading-spinner loading-md"></div>
                            </div>
                            <div v-else-if="visitorFunnels?.funnels" class="space-y-6">
                                <div v-for="funnel in visitorFunnels.funnels" :key="funnel.name"
                                    class="border border-base-300 rounded-lg p-4">
                                    <h3 class="font-semibold text-lg mb-4">{{ funnel.name }}</h3>
                                    <div class="space-y-3">
                                        <div v-for="(step, index) in funnel.steps" :key="index"
                                            class="flex items-center justify-between">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold">
                                                    {{ index + 1 }}
                                                </div>
                                                <span class="font-medium">{{ step.step }}</span>
                                            </div>
                                            <div class="flex items-center gap-4">
                                                <span class="text-lg font-bold">{{ formatNumber(step.count) }}</span>
                                                <span v-if="step.dropoffRate > 0" class="text-error text-sm">
                                                    -{{ step.dropoffRate.toFixed(1) }}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Entry and Exit Pages -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Top Entry Pages -->
                        <div class="card bg-base-100 shadow-sm">
                            <div
                                class="bg-base-200 px-6 py-4 rounded-t-lg flex justify-between items-center border-b border-base-300">
                                <h2 class="card-title">
                                    <LucideLogIn :size="20" />
                                    Top Entry Pages
                                </h2>
                            </div>
                            <div class="card-body">
                                <div v-if="isLoadingEntryExit" class="flex justify-center py-8">
                                    <div class="loading loading-spinner loading-md"></div>
                                </div>
                                <div v-else-if="entryExitPages?.entryPages" class="space-y-2">
                                    <div v-for="page in entryExitPages.entryPages.slice(0, 10)" :key="page.path"
                                        class="flex items-center justify-between py-2 border-b border-base-200 last:border-b-0">
                                        <span class="text-sm font-medium truncate flex-1 mr-4" :title="page.path">
                                            {{ page.path }}
                                        </span>
                                        <span class="text-sm text-base-content/60">{{ formatNumber(page.count) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Top Exit Pages -->
                        <div class="card bg-base-100 shadow-sm">
                            <div class="aeader bg-base-200 px-6 py-4 rounded-t-lg">
                                <h2 class="card-title">
                                    <LucideLogOut :size="20" />
                                    Top Exit Pages
                                </h2>
                            </div>
                            <div class="card-body">
                                <div v-if="isLoadingEntryExit" class="flex justify-center py-8">
                                    <div class="loading loading-spinner loading-md"></div>
                                </div>
                                <div v-else-if="entryExitPages?.exitPages" class="space-y-2">
                                    <div v-for="page in entryExitPages.exitPages.slice(0, 10)" :key="page.path"
                                        class="flex items-center justify-between py-2 border-b border-base-200 last:border-b-0">
                                        <span class="text-sm font-medium truncate flex-1 mr-4" :title="page.path">
                                            {{ page.path }}
                                        </span>
                                        <span class="text-sm text-base-content/60">{{ formatNumber(page.count) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Visitor Journeys -->
                    <div class="card bg-base-100 shadow-sm">
                        <div class="card-header bg-base-200 px-6 py-4 rounded-t-lg">
                            <h2 class="card-title">
                                <LucideRoute :size="20" />
                                Recent Visitor Journeys
                            </h2>
                            <div class="flex items-center gap-2">
                                <label class="text-sm">Show:</label>
                                <select v-model="journeyLimit" class="select select-xs select-bordered"
                                    @change="handleJourneyLimitChange">
                                    <option :value="20">20</option>
                                    <option :value="50">50</option>
                                    <option :value="100">100</option>
                                </select>
                            </div>
                        </div>
                        <div class="card-body">
                            <div v-if="isLoadingJourneys" class="flex justify-center py-12">
                                <div class="loading loading-spinner loading-md"></div>
                            </div>
                            <div v-else-if="visitorJourneys?.journeys" class="space-y-4">
                                <div v-for="journey in visitorJourneys.journeys.slice(0, 20)" :key="journey.fingerprint"
                                    class="border border-base-300 rounded-lg p-4 hover:border-primary/20 transition-colors">
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div class="w-2 h-2 rounded-full bg-primary"></div>
                                            <span class="font-mono text-sm text-base-content/60">{{
                                                journey.fingerprint.substring(0, 12) }}...</span>
                                        </div>
                                        <div class="text-right text-sm text-base-content/60">
                                            <div>{{ formatNumber(journey.totalPages) }} pages</div>
                                            <div>{{ formatDuration(journey.sessionDuration) }}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 overflow-x-auto pb-2">
                                        <template v-for="(step, index) in journey.path.slice(0, 8)" :key="index">
                                            <div class="flex-shrink-0 px-3 py-1 bg-base-200 rounded text-xs truncate max-w-32"
                                                :title="step.page">
                                                {{ step.page }}
                                            </div>
                                            <LucideArrowRight v-if="index < Math.min(journey.path.length - 1, 7)"
                                                :size="12" class="flex-shrink-0 text-base-content/40" />
                                        </template>
                                        <div v-if="journey.path.length > 8" class="flex items-center gap-2">
                                            <span class="flex-shrink-0 text-xs text-base-content/60">
                                                +{{ journey.path.length - 8 }} more
                                            </span>
                                            <button
                                                @click="openJourneyModal(journey)"
                                                class="btn btn-xs btn-outline btn-primary"
                                            >
                                                <LucideEye :size="12" />
                                                Read More
                                            </button>
                                        </div>
                                        <button
                                            v-else
                                            @click="openJourneyModal(journey)"
                                            class="btn btn-xs btn-outline btn-primary ml-2"
                                        >
                                            <LucideEye :size="12" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Journey Details Modal -->
        <div v-if="selectedJourney" class="modal modal-open">
            <div class="modal-box max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg">Complete Visitor Journey</h3>
                    <button @click="closeJourneyModal" class="btn btn-sm btn-circle btn-ghost">
                        <LucideX :size="20" />
                    </button>
                </div>

                <!-- Journey Summary -->
                <div class="bg-base-200 rounded-lg p-4 mb-4">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div class="text-base-content/60">Visitor ID</div>
                            <div class="font-mono font-semibold">{{ selectedJourney.fingerprint.substring(0, 16) }}...</div>
                        </div>
                        <div>
                            <div class="text-base-content/60">Total Pages</div>
                            <div class="font-semibold">{{ formatNumber(selectedJourney.totalPages) }}</div>
                        </div>
                        <div>
                            <div class="text-base-content/60">Session Duration</div>
                            <div class="font-semibold">{{ formatDuration(selectedJourney.sessionDuration) }}</div>
                        </div>
                        <div>
                            <div class="text-base-content/60">Time Period</div>
                            <div class="font-semibold text-xs">
                                {{ formatDateTime(selectedJourney.firstVisitAt) }} - {{ formatDateTime(selectedJourney.lastVisitAt) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Complete Journey Path -->
                <div class="flex-1 overflow-y-auto">
                    <h4 class="font-semibold mb-3">Complete Journey Path ({{ selectedJourney.path.length }} pages)</h4>
                    <div class="space-y-3">
                        <div
                            v-for="(step, index) in selectedJourney.path"
                            :key="index"
                            class="flex items-center gap-4 p-3 bg-base-100 rounded-lg hover:bg-base-200 transition-colors"
                        >
                            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold">
                                {{ index + 1 }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm truncate" :title="step.page">
                                    {{ step.page }}
                                </div>
                                <div class="text-xs text-base-content/60">
                                    {{ formatDateTime(step.timestamp) }}
                                </div>
                            </div>
                            <div v-if="index < selectedJourney.path.length - 1" class="flex-shrink-0">
                                <LucideArrowDown :size="16" class="text-base-content/40" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Actions -->
                <div class="modal-action mt-4">
                    <button @click="closeJourneyModal" class="btn btn-primary">
                        Close
                    </button>
                </div>
            </div>
            <div class="modal-backdrop bg-black/50" @click="closeJourneyModal"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    LucideRefreshCw,
    LucideAlertCircle,
    LucideUsers,
    LucideRoute,
    LucideArrowRightLeft,
    LucideTrendingUp,
    LucideLogIn,
    LucideLogOut,
    LucideArrowRight,
    LucideEye,
    LucideX,
    LucideArrowDown
} from 'lucide-vue-next'

definePageMeta({
    layout: 'control-panel'
})

// Store
const visitAnalyticsStore = useVisitAnalyticsStore()
const {
    visitorJourneys,
    pathFlow,
    visitorFunnels,
    entryExitPages,
    selectedPeriod,
    journeyLimit,
    isLoading,
    isLoadingJourneys,
    isLoadingPathFlow,
    isLoadingFunnels,
    isLoadingEntryExit,
    isAnyLoading,
    hasJourneyData,
    isError,
    errorMessage
} = storeToRefs(visitAnalyticsStore)

// Modal state
const selectedJourney = ref<any>(null)

// Computed
const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num)
}

const formatDuration = (ms: number): string => {
    if (ms < 60000) return `${Math.round(ms / 1000)}s`
    if (ms < 3600000) return `${Math.round(ms / 60000)}m`
    return `${Math.round(ms / 3600000)}h`
}

const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Methods
const refreshData = async () => {
    await visitAnalyticsStore.fetchAllJourneyAnalytics()
}

const handlePeriodChange = async () => {
    await visitAnalyticsStore.setPeriod(selectedPeriod.value)
    await visitAnalyticsStore.fetchAllJourneyAnalytics()
}

const handleJourneyLimitChange = async () => {
    await visitAnalyticsStore.setJourneyLimit(journeyLimit.value)
}

// Modal methods
const openJourneyModal = (journey: any) => {
    selectedJourney.value = journey
}

const closeJourneyModal = () => {
    selectedJourney.value = null
}

// Lifecycle
onMounted(() => {
    if (!hasJourneyData.value) {
        visitAnalyticsStore.fetchAllJourneyAnalytics()
    }
})
</script>

<style scoped></style>
