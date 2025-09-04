<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <ButtonLink :to="`/cp/my-events/form?id=${eventId}`" class="btn btn-sm btn-outline">
                    <LucideArrowLeft class="h-4 w-4 mr-1" />
                    Back to Event
                </ButtonLink>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Event Registrations</h1>
                    <p v-if="eventTitle" class="text-gray-600">{{ eventTitle }}</p>
                </div>
            </div>
        </div>

        <!-- Registration Management -->
        <CpEventRegistrations :registrations="registrations" :pagination="pagination" :isLoading="isLoading"
            :isUpdating="isUpdating" :isExporting="isExporting" @refresh="loadRegistrations" @filter="handleFilter"
            @confirm="confirmRegistration" @cancel="cancelRegistration" @export="exportRegistrations" />
    </div>
</template>

<script lang="ts" setup>
import { LucideArrowLeft } from 'lucide-vue-next'
import type { EventRegistration } from '~/interfaces/event-registration-interface'

definePageMeta({
    layout: 'control-panel'
})

const route = useRoute()
const eventId = route.params.id as string

// Reactive data
const registrations = ref<EventRegistration[]>([])
const pagination = ref<any>(null)
const isLoading = ref(false)
const isUpdating = ref(false)
const eventTitle = ref<string>('')

// Current filters
const currentFilters = ref<{
    status?: string
    search?: string
    page?: number
}>({})

// Load event details
const loadEventDetails = async () => {
    try {
        const event = await Api.get(`/v1/event/my/${eventId}`) as any
        eventTitle.value = event.title
    } catch (error) {
        console.error('Failed to load event details:', error)
    }
}

// Load registrations
const loadRegistrations = async (filters?: any) => {
    if (!eventId) return

    isLoading.value = true

    try {
        const queryParams = new URLSearchParams()

        if (filters?.status) {
            queryParams.append('status', filters.status)
        }
        if (filters?.search) {
            queryParams.append('search', filters.search)
        }
        if (filters?.page) {
            queryParams.append('page', filters.page.toString())
        }

        const queryString = queryParams.toString()
        const url = `/v1/event/${eventId}/registrations${queryString ? `?${queryString}` : ''}`

        const response = await Api.get(url) as any
        registrations.value = response.data || []
        pagination.value = {
            page: response.page || 1,
            last_page: response.last_page || 1,
            total: response.total || 0
        }

        currentFilters.value = filters || {}
    } catch (error: any) {
        console.error('Failed to load registrations:', error)

        // Show error message
        if (error.status === 403) {
            await navigateTo('/cp/my-events')
        }
    } finally {
        isLoading.value = false
    }
}

// Handle filter changes
const handleFilter = (filters: any) => {
    loadRegistrations(filters)
}

// Confirm registration
const confirmRegistration = async (registrationId: string) => {
    isUpdating.value = true

    try {
        await Api.post(`/v1/event/registration/${registrationId}/confirm`)

        // Reload registrations
        await loadRegistrations(currentFilters.value)

        // Show success message
        // You can add a toast notification here
    } catch (error: any) {
        console.error('Failed to confirm registration:', error)
        // Show error message
    } finally {
        isUpdating.value = false
    }
}

// Cancel registration
const cancelRegistration = async (registrationId: string) => {
    // Ask for cancellation reason
    const cancellationNote = prompt('Please provide a reason for cancellation (optional):')

    isUpdating.value = true

    try {
        // Send cancellation note in the request body
        await Api.remove(`/v1/event/registration/${registrationId}`, {
            cancellationNote: cancellationNote || undefined
        })

        // Reload registrations
        await loadRegistrations(currentFilters.value)

        // Show success message
        // You can add a toast notification here
    } catch (error: any) {
        console.error('Failed to cancel registration:', error)
        // Show error message
    } finally {
        isUpdating.value = false
    }
}

// Export registrations
const isExporting = ref(false)

const exportRegistrations = async (exportType: 'all' | 'confirmed') => {
    if (!eventId) return

    isExporting.value = true

    try {
        // Build query parameters for current filters
        const queryParams = new URLSearchParams()

        // Add export type filter
        if (exportType === 'confirmed') {
            queryParams.append('status', 'CONFIRMED')
        } else {
            // For 'all' type, use existing filters if any
            if (currentFilters.value.status) {
                queryParams.append('status', currentFilters.value.status)
            }
        }
        
        if (currentFilters.value.search) {
            queryParams.append('search', currentFilters.value.search)
        }

        const queryString = queryParams.toString()
        const url = `/v1/event/${eventId}/registrations/export${queryString ? `?${queryString}` : ''}`

        // Make request to export endpoint
        const response = await Api.getBlob(url)

        // Create download link
        const blob = new Blob([response], {
            type: 'application/pdf'
        })
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')

        // Generate filename with current date and export type
        const today = new Date().toISOString().split('T')[0]
        const typeLabel = exportType === 'confirmed' ? '-confirmed' : ''
        const filename = `${eventTitle.value?.toLowerCase().replace(/\s+/g, '-') || 'event'}-registrations${typeLabel}-${today}.pdf`

        link.href = downloadUrl
        link.download = filename
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up
        URL.revokeObjectURL(downloadUrl)

    } catch (error: any) {
        console.error('Failed to export registrations:', error)

        // Show user-friendly error message
        let errorMessage = 'Failed to export registrations'
        if (error.status === 403) {
            errorMessage = 'You do not have permission to export registrations'
        } else if (error.status === 404) {
            errorMessage = 'Event not found'
        }

        alert(errorMessage)
    } finally {
        isExporting.value = false
    }
}

// Initialize
onMounted(async () => {
    await loadEventDetails()
    await loadRegistrations()
})

// SEO
useSeoMeta({
    title: `Event Registrations - ${eventTitle.value || 'Event'}`,
    description: 'Manage event registrations and approvals'
})
</script>
