import { defineStore } from 'pinia'

// Types for visit analytics
export interface VisitMetric {
    total: number
    today: number
    yesterday: number
    thisWeek: number
    lastWeek: number
    thisMonth: number
    lastMonth: number
    growthRate: number
}

export interface VisitAnalytics {
    visits: VisitMetric
    uniqueVisitors: VisitMetric
    averageSessionDuration: number
    bounceRate: number
    avgVisitsPerVisitor: number
}

export interface VisitorDemographics {
    totalVisitors: number
    newVisitors: number
    returningVisitors: number
    registeredUsers: number
    anonymousUsers: number
}

export interface VisitorAnalytics {
    demographics: VisitorDemographics
    dailyActiveVisitors: { date: string; count: number }[]
    visitorRetention: {
        day1: number
        day7: number
        day30: number
    }
}

export interface TopPage {
    path: string
    visits: number
    uniqueVisitors: number
    title?: string
    contentType?: string
    avgTimeOnPage?: number
}

export interface TopPages {
    pages: TopPage[]
    totalPages: number
}

export interface TimelineDataPoint {
    timestamp: string
    visits: number
    uniqueVisitors: number
    pageViews: number
}

export interface VisitTimeline {
    timeline: TimelineDataPoint[]
    interval: string
    totalDataPoints: number
}

export interface Referrer {
    referrer: string
    visits: number
    uniqueVisitors: number
    percentage: number
}

export interface TopReferrers {
    referrers: Referrer[]
    directTraffic: number
    totalReferrers: number
}

export interface Browser {
    name: string
    visits: number
    percentage: number
}

export interface Device {
    type: string
    visits: number
    percentage: number
}

export interface OS {
    name: string
    visits: number
    percentage: number
}

export interface UserAgentAnalytics {
    browsers: Browser[]
    devices: Device[]
    operatingSystems: OS[]
    totalAnalyzed: number
}

// Visitor Journey Analytics Types
export interface VisitorUser {
    id: string
    name: string
    username: string
    email: string
}

export interface VisitorJourney {
    fingerprint: string
    firstVisitAt: string
    lastVisitAt: string
    totalPages: number
    user: VisitorUser | null
    path: { page: string; timestamp: string }[]
    sessionDuration: number
}

export interface VisitorJourneys {
    journeys: VisitorJourney[]
    totalJourneys: number
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface PathFlow {
    from: string
    to: string
    value: number
}

export interface PathFlowAnalytics {
    flows: PathFlow[]
    totalTransitions: number
    pageCounts: { [key: string]: number }
}

export interface FunnelStep {
    step: string
    count: number
    dropoffRate: number
}

export interface Funnel {
    name: string
    steps: FunnelStep[]
}

export interface VisitorFunnels {
    funnels: Funnel[]
}

export interface EntryExitPage {
    path: string
    count: number
}

export interface EntryExitPages {
    entryPages: EntryExitPage[]
    exitPages: EntryExitPage[]
    totalUniqueVisitors: number
}

interface VisitAnalyticsStoreState {
    // Data
    visitAnalytics?: VisitAnalytics
    visitorAnalytics?: VisitorAnalytics
    topPages?: TopPages
    timeline?: VisitTimeline
    referrers?: TopReferrers
    userAgentAnalytics?: UserAgentAnalytics

    // Journey Analytics Data
    visitorJourneys?: VisitorJourneys
    pathFlow?: PathFlowAnalytics
    visitorFunnels?: VisitorFunnels
    entryExitPages?: EntryExitPages

    // Parameters
    selectedPeriod: number
    timelineInterval: 'hour' | 'day' | 'week'
    journeyLimit: number
    journeyPage: number

    // Loading states
    isLoading: boolean
    isLoadingAnalytics: boolean
    isLoadingVisitors: boolean
    isLoadingPages: boolean
    isLoadingTimeline: boolean
    isLoadingReferrers: boolean
    isLoadingUserAgents: boolean
    isLoadingJourneys: boolean
    isLoadingPathFlow: boolean
    isLoadingFunnels: boolean
    isLoadingEntryExit: boolean

    // Error state
    isError: boolean
    errorMessage: string | null
}

export const useVisitAnalyticsStore = defineStore('visitAnalytics', {
    state: (): VisitAnalyticsStoreState => ({
        // Data
        visitAnalytics: undefined,
        visitorAnalytics: undefined,
        topPages: undefined,
        timeline: undefined,
        referrers: undefined,
        userAgentAnalytics: undefined,

        // Journey Analytics Data
        visitorJourneys: undefined,
        pathFlow: undefined,
        visitorFunnels: undefined,
        entryExitPages: undefined,

        // Parameters
        selectedPeriod: 30,
        timelineInterval: 'day',
        journeyLimit: 20,
        journeyPage: 1,

        // Loading states
        isLoading: false,
        isLoadingAnalytics: false,
        isLoadingVisitors: false,
        isLoadingPages: false,
        isLoadingTimeline: false,
        isLoadingReferrers: false,
        isLoadingUserAgents: false,
        isLoadingJourneys: false,
        isLoadingPathFlow: false,
        isLoadingFunnels: false,
        isLoadingEntryExit: false,

        // Error state
        isError: false,
        errorMessage: null
    }),

    getters: {
        hasData: (state): boolean => {
            return !!(state.visitAnalytics && state.visitorAnalytics && state.topPages && state.timeline)
        },

        isAnyLoading: (state): boolean => {
            return state.isLoading ||
                state.isLoadingAnalytics ||
                state.isLoadingVisitors ||
                state.isLoadingPages ||
                state.isLoadingTimeline ||
                state.isLoadingReferrers ||
                state.isLoadingUserAgents ||
                state.isLoadingJourneys ||
                state.isLoadingPathFlow ||
                state.isLoadingFunnels ||
                state.isLoadingEntryExit
        },

        hasJourneyData: (state): boolean => {
            return !!(state.visitorJourneys && state.pathFlow && state.visitorFunnels && state.entryExitPages)
        }
    },

    actions: {
        // Fetch all analytics data
        async fetchAllAnalytics(days?: number) {
            if (days) this.selectedPeriod = days

            this.isLoading = true
            this.isError = false
            this.errorMessage = null

            try {
                await Promise.all([
                    this.fetchVisitAnalytics(),
                    this.fetchVisitorAnalytics(),
                    this.fetchTopPages(),
                    this.fetchTimeline(),
                    this.fetchReferrers(),
                    this.fetchUserAgentAnalytics()
                ])
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to load analytics data'
                console.error('Analytics error:', error)
            } finally {
                this.isLoading = false
            }
        },

        // Fetch visit analytics
        async fetchVisitAnalytics() {
            this.isLoadingAnalytics = true
            try {
                const response = await Api.get(`/v1/visit-stats/analytics?days=${this.selectedPeriod}`) as any
                this.visitAnalytics = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch visit analytics'
                throw error
            } finally {
                this.isLoadingAnalytics = false
            }
        },

        // Fetch visitor analytics
        async fetchVisitorAnalytics() {
            this.isLoadingVisitors = true
            try {
                const response = await Api.get(`/v1/visit-stats/visitors?days=${this.selectedPeriod}`) as any
                this.visitorAnalytics = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch visitor analytics'
                throw error
            } finally {
                this.isLoadingVisitors = false
            }
        },

        // Fetch top pages
        async fetchTopPages(limit: number = 20) {
            this.isLoadingPages = true
            try {
                const response = await Api.get(`/v1/visit-stats/top-pages?limit=${limit}&days=${this.selectedPeriod}`) as any
                this.topPages = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch top pages'
                throw error
            } finally {
                this.isLoadingPages = false
            }
        },

        // Fetch timeline data
        async fetchTimeline() {
            this.isLoadingTimeline = true
            try {
                const response = await Api.get(`/v1/visit-stats/timeline?days=${this.selectedPeriod}&interval=${this.timelineInterval}`) as any
                this.timeline = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch timeline data'
                throw error
            } finally {
                this.isLoadingTimeline = false
            }
        },

        // Fetch top referrers
        async fetchReferrers(limit: number = 20) {
            this.isLoadingReferrers = true
            try {
                const response = await Api.get(`/v1/visit-stats/referrers?limit=${limit}&days=${this.selectedPeriod}`) as any
                this.referrers = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch referrers'
                throw error
            } finally {
                this.isLoadingReferrers = false
            }
        },

        // Fetch user agent analytics
        async fetchUserAgentAnalytics() {
            this.isLoadingUserAgents = true
            try {
                const response = await Api.get(`/v1/visit-stats/user-agents?days=${this.selectedPeriod}`) as any
                this.userAgentAnalytics = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch user agent analytics'
                throw error
            } finally {
                this.isLoadingUserAgents = false
            }
        },

        // Set selected period and refresh data
        async setPeriod(days: number) {
            this.selectedPeriod = days
            await this.fetchAllAnalytics()
        },

        // Set timeline interval and refresh timeline
        async setTimelineInterval(interval: 'hour' | 'day' | 'week') {
            this.timelineInterval = interval
            await this.fetchTimeline()
        },

        // Fetch visitor journey analytics
        async fetchVisitorJourneys(limit?: number, page?: number) {
            this.isLoadingJourneys = true
            try {
                const journeyLimit = limit || this.journeyLimit
                const journeyPage = page || this.journeyPage
                const response = await Api.get(`/v1/visit-stats/journeys?days=${this.selectedPeriod}&limit=${journeyLimit}&page=${journeyPage}`) as any
                this.visitorJourneys = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch visitor journeys'
                throw error
            } finally {
                this.isLoadingJourneys = false
            }
        },

        // Fetch path flow analytics
        async fetchPathFlow() {
            this.isLoadingPathFlow = true
            try {
                const response = await Api.get(`/v1/visit-stats/path-flow?days=${this.selectedPeriod}`) as any
                this.pathFlow = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch path flow data'
                throw error
            } finally {
                this.isLoadingPathFlow = false
            }
        },

        // Fetch visitor funnels
        async fetchVisitorFunnels() {
            this.isLoadingFunnels = true
            try {
                const response = await Api.get(`/v1/visit-stats/funnels?days=${this.selectedPeriod}`) as any
                this.visitorFunnels = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch visitor funnels'
                throw error
            } finally {
                this.isLoadingFunnels = false
            }
        },

        // Fetch entry/exit pages
        async fetchEntryExitPages() {
            this.isLoadingEntryExit = true
            try {
                const response = await Api.get(`/v1/visit-stats/entry-exit?days=${this.selectedPeriod}`) as any
                this.entryExitPages = response.data || response
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to fetch entry/exit pages'
                throw error
            } finally {
                this.isLoadingEntryExit = false
            }
        },

        // Fetch all journey analytics
        async fetchAllJourneyAnalytics() {
            this.isLoading = true
            this.isError = false
            this.errorMessage = null

            try {
                await Promise.all([
                    this.fetchVisitorJourneys(),
                    this.fetchPathFlow(),
                    this.fetchVisitorFunnels(),
                    this.fetchEntryExitPages()
                ])
            } catch (error: any) {
                this.isError = true
                this.errorMessage = 'Failed to load journey analytics data'
                console.error('Journey analytics error:', error)
            } finally {
                this.isLoading = false
            }
        },

        // Set journey limit and refresh journeys
        async setJourneyLimit(limit: number) {
            this.journeyLimit = limit
            this.journeyPage = 1 // Reset to first page when limit changes
            await this.fetchVisitorJourneys()
        },

        // Set journey page and refresh journeys
        async setJourneyPage(page: number) {
            this.journeyPage = page
            await this.fetchVisitorJourneys()
        },

        // Navigate to next page
        async nextJourneyPage() {
            if (this.visitorJourneys?.hasNextPage) {
                await this.setJourneyPage(this.journeyPage + 1)
            }
        },

        // Navigate to previous page
        async prevJourneyPage() {
            if (this.visitorJourneys?.hasPrevPage) {
                await this.setJourneyPage(this.journeyPage - 1)
            }
        },

        // Reset store state
        reset() {
            this.visitAnalytics = undefined
            this.visitorAnalytics = undefined
            this.topPages = undefined
            this.timeline = undefined
            this.referrers = undefined
            this.userAgentAnalytics = undefined

            this.visitorJourneys = undefined
            this.pathFlow = undefined
            this.visitorFunnels = undefined
            this.entryExitPages = undefined

            this.selectedPeriod = 30
            this.timelineInterval = 'day'
            this.journeyLimit = 20
            this.journeyPage = 1

            this.isLoading = false
            this.isLoadingAnalytics = false
            this.isLoadingVisitors = false
            this.isLoadingPages = false
            this.isLoadingTimeline = false
            this.isLoadingReferrers = false
            this.isLoadingUserAgents = false
            this.isLoadingJourneys = false
            this.isLoadingPathFlow = false
            this.isLoadingFunnels = false
            this.isLoadingEntryExit = false

            this.isError = false
            this.errorMessage = null
        }
    }
})
