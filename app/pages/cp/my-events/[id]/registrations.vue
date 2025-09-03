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
        <CpEventRegistrations
            :registrations="registrations"
            :pagination="pagination"
            :isLoading="isLoading"
            :isUpdating="isUpdating"
            @refresh="loadRegistrations"
            @filter="handleFilter"
            @confirm="confirmRegistration"
            @cancel="cancelRegistration"
            @export="exportRegistrations"
        />
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
    isUpdating.value = true
    
    try {
        await Api.remove(`/v1/event/registration/${registrationId}`)
        
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
const exportRegistrations = async () => {
    try {
        // Create CSV content
        if (!registrations.value.length) {
            alert('No registrations to export')
            return
        }
        
        // Get all unique form fields from registrations
        const allFormFields = new Set<string>()
        registrations.value.forEach(reg => {
            if (reg.formData) {
                Object.keys(reg.formData).forEach(key => allFormFields.add(key))
            }
        })
        
        const formFieldsArray = Array.from(allFormFields)
        
        // Create CSV headers
        const headers = [
            'Name',
            'Email',
            'Status',
            'Registered Date',
            'Confirmed Date',
            'Cancelled Date',
            'Cancellation Note',
            ...formFieldsArray.map(field => field.replace(/_/g, ' ').toUpperCase())
        ]
        
        // Create CSV rows
        const rows = registrations.value.map(reg => {
            const formData = formFieldsArray.map(field => {
                const value = reg.formData?.[field]
                if (Array.isArray(value)) {
                    return `"${value.join(', ')}"`
                }
                return value ? `"${String(value).replace(/"/g, '""')}"` : ''
            })
            
            return [
                `"${reg.user?.name || ''}"`,
                `"${reg.user?.email || ''}"`,
                reg.status,
                new Date(reg.registeredAt).toLocaleDateString(),
                reg.confirmedAt ? new Date(reg.confirmedAt).toLocaleDateString() : '',
                reg.cancelledAt ? new Date(reg.cancelledAt).toLocaleDateString() : '',
                reg.cancellationNote ? `"${reg.cancellationNote.replace(/"/g, '""')}"` : '',
                ...formData
            ]
        })
        
        // Create CSV content
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `event-registrations-${eventId}-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
    } catch (error) {
        console.error('Failed to export registrations:', error)
        alert('Failed to export registrations')
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