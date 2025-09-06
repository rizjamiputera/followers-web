<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <LucideUserCheck class="h-5 w-5 text-green-600" />
                <h3 class="text-lg font-semibold text-gray-900">Event Registrations</h3>
                <div class="badge badge-success">{{ totalCount }}</div>
            </div>

            <div class="flex gap-2">
                <!-- Export Button -->
                <button @click="showExportModal = true"
                    :disabled="!registrations || registrations.length === 0 || isExporting"
                    class="btn btn-sm btn-outline btn-success">
                    <LucideDownload v-if="!isExporting" class="h-4 w-4 mr-1" />
                    <span v-if="isExporting" class="loading loading-spinner loading-xs mr-1"></span>
                    {{ isExporting ? 'Exporting...' : 'Export PDF' }}
                </button>

                <!-- Refresh Button -->
                <button @click="$emit('refresh')" :disabled="isLoading" class="btn btn-sm btn-outline">
                    <LucideRefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-3 gap-4">
            <div class="stat bg-green-50 rounded-lg">
                <div class="stat-value text-green-600">{{ confirmedCount }}</div>
                <div class="stat-title text-green-800">Confirmed</div>
            </div>
            <div class="stat bg-amber-50 rounded-lg">
                <div class="stat-value text-amber-600">{{ pendingCount }}</div>
                <div class="stat-title text-amber-800">Pending</div>
            </div>
            <div class="stat bg-red-50 rounded-lg">
                <div class="stat-value text-red-600">{{ cancelledCount }}</div>
                <div class="stat-title text-red-800">Cancelled</div>
            </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-4 items-center">
            <div class="form-control">
                <select v-model="filters.status" class="select select-bordered select-sm">
                    <option value="">All Status</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            <div class="form-control flex-1 max-w-sm">
                <div class="relative">
                    <input type="text" v-model="filters.search" placeholder="Search by name or email..."
                        class="input input-bordered input-sm w-full pr-10" />
                    <LucideSearch class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
            </div>

            <button @click="applyFilters" class="btn btn-sm btn-primary" :disabled="isLoading">
                <LucideFilter class="h-4 w-4 mr-1" />
                Filter
            </button>

            <button v-if="hasActiveFilters" @click="clearFilters" class="btn btn-sm btn-ghost">
                Clear
            </button>
        </div>

        <!-- Registrations List -->
        <div v-if="isLoading" class="flex justify-center py-8">
            <LucideLoader2 class="h-6 w-6 animate-spin text-green-600" />
        </div>

        <div v-else-if="!registrations || registrations.length === 0" class="text-center py-8 text-gray-500">
            <LucideUsers class="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No registrations found</p>
        </div>

        <div v-else class="space-y-3">
            <div v-for="registration in registrations" :key="registration.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                        <!-- User Avatar -->
                        <div class="avatar" :class="!registration.user?.avatar_md ? 'avatar-placeholder' : ''">
                            <div class="w-10 h-10 rounded-full bg-green-100 bg-cover bg-center"
                                :style="{ backgroundImage: `url(${registration.user?.avatar_md})` }">
                                <div class="text-green-600 font-semibold text-xl" v-if="!registration.user?.avatar_md">
                                    {{ registration.user?.name?.charAt(0).toUpperCase() }}
                                </div>
                            </div>
                        </div>

                        <!-- User Info -->
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <h4 class="font-semibold text-gray-900">{{ registration.user?.name }}</h4>
                                <div class="badge badge-sm" :class="getStatusBadgeClass(registration.status)">
                                    {{ registration.status }}
                                </div>
                            </div>

                            <p class="text-gray-600 text-sm mb-2">{{ registration.user?.email }}</p>

                            <div class="text-xs text-gray-500">
                                Registered: {{ formatDate(registration.registeredAt) }}
                                <span v-if="registration.confirmedAt">
                                    • Confirmed: {{ formatDate(registration.confirmedAt) }}
                                </span>
                                <span v-if="registration.cancelledAt">
                                    • Cancelled: {{ formatDate(registration.cancelledAt) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2">
                        <Button @click="viewRegistration(registration)" class="btn btn-sm btn-circle btn-outline">
                            <LucideEye class="h-3 w-3" />
                        </Button>

                        <Button v-if="registration.status === 'PENDING'" @click="confirmRegistration(registration.id)"
                            class="btn btn-sm btn-circle btn-success" :disabled="isUpdating">
                            <LucideCheck class="h-3 w-3" />
                        </Button>

                        <Button v-if="registration.status !== 'CANCELLED'" @click="cancelRegistration(registration.id)"
                            class="btn btn-sm btn-circle btn-error btn-outline" :disabled="isUpdating">
                            <LucideX class="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <!-- Form Data Preview -->
                <div v-if="registration.formData && Object.keys(registration.formData).length > 0"
                    class="mt-3 pt-3 border-t border-gray-100">
                    <div class="flex flex-col gap-2 text-xs">
                        <div v-for="(value, key) in registration.formData" :key="key" class="flex flex-col gap-1">
                            <div class="text-gray-500 capitalize">{{ key.replace(/_/g, ' ') }}:</div>
                            <div class="ml-1 font-medium whitespace-pre">{{ formatFormValue(value) }}</div>
                        </div>
                    </div>
                </div>

                <!-- Cancellation Note -->
                <div v-if="registration.cancellationNote" class="mt-3 p-2 bg-red-50 rounded text-sm">
                    <strong class="text-red-800">Cancellation Reason:</strong>
                    <span class="text-red-700 ml-2">{{ registration.cancellationNote }}</span>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="flex justify-center">
            <div class="btn-group">
                <button v-for="page in paginationPages" :key="page" @click="changePage(page)" class="btn btn-sm"
                    :class="{ 'btn-active': page === pagination.page }">
                    {{ page }}
                </button>
            </div>
        </div>

        <!-- Registration Detail Modal -->
        <div v-if="selectedRegistration"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold">Registration Details</h3>
                        <button @click="selectedRegistration = null" class="text-gray-400 hover:text-gray-600">
                            <LucideX class="h-6 w-6" />
                        </button>
                    </div>

                    <!-- User Info -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="avatar">
                                <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                    <span class="text-green-600 font-semibold text-xl">
                                        {{ selectedRegistration.user?.name?.charAt(0).toUpperCase() }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 class="text-lg font-semibold">{{ selectedRegistration.user?.name }}</h4>
                                <p class="text-gray-600">{{ selectedRegistration.user?.email }}</p>
                                <div class="badge" :class="getStatusBadgeClass(selectedRegistration.status)">
                                    {{ selectedRegistration.status }}
                                </div>
                            </div>
                        </div>

                        <!-- Form Data -->
                        <div v-if="selectedRegistration.formData" class="border-t pt-4">
                            <h5 class="font-semibold mb-3">Form Responses</h5>
                            <div class="space-y-2">
                                <div v-for="(value, key) in selectedRegistration.formData" :key="key"
                                    class="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <strong class="text-gray-700 capitalize min-w-32">
                                        {{ key.replace(/_/g, ' ') }}:
                                    </strong>
                                    <span class="flex-1">{{ formatFormValue(value) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Timestamps -->
                        <div class="border-t pt-4 text-sm text-gray-600">
                            <p>Registered: {{ formatDateTime(selectedRegistration.registeredAt) }}</p>
                            <p v-if="selectedRegistration.confirmedAt">
                                Confirmed: {{ formatDateTime(selectedRegistration.confirmedAt) }}
                            </p>
                            <p v-if="selectedRegistration.cancelledAt">
                                Cancelled: {{ formatDateTime(selectedRegistration.cancelledAt) }}
                            </p>
                        </div>

                        <!-- Actions -->
                        <div class="border-t pt-4 flex gap-2">
                            <button v-if="selectedRegistration.status === 'PENDING'"
                                @click="confirmRegistration(selectedRegistration.id); selectedRegistration = null"
                                class="btn btn-success" :disabled="isUpdating">
                                <LucideCheck class="h-4 w-4 mr-2" />
                                Confirm Registration
                            </button>

                            <button v-if="selectedRegistration.status !== 'CANCELLED'"
                                @click="cancelRegistration(selectedRegistration.id); selectedRegistration = null"
                                class="btn btn-error btn-outline" :disabled="isUpdating">
                                <LucideX class="h-4 w-4 mr-2" />
                                Cancel Registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Export Options Modal -->
        <div v-if="showExportModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg max-w-md w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold">Export Options</h3>
                        <button @click="showExportModal = false" class="text-gray-400 hover:text-gray-600">
                            <LucideX class="h-6 w-6" />
                        </button>
                    </div>

                    <div class="space-y-4">
                        <p class="text-gray-600">Choose which registrations to export:</p>
                        
                        <!-- Export Options -->
                        <div class="space-y-3">
                            <button @click="exportWithFilter('all')"
                                class="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                                <div class="flex items-center gap-3">
                                    <LucideUsers class="h-5 w-5 text-gray-600" />
                                    <div>
                                        <div class="font-medium">All Registrations</div>
                                        <div class="text-sm text-gray-500">Export all registrations ({{ totalCount }} total)</div>
                                    </div>
                                </div>
                            </button>

                            <button @click="exportWithFilter('confirmed')"
                                class="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                                <div class="flex items-center gap-3">
                                    <LucideUserCheck class="h-5 w-5 text-green-600" />
                                    <div>
                                        <div class="font-medium">Confirmed Only</div>
                                        <div class="text-sm text-gray-500">Export only confirmed registrations ({{ confirmedCount }} total)</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    LucideUserCheck, LucideDownload, LucideRefreshCw, LucideSearch,
    LucideFilter, LucideLoader2, LucideUsers, LucideEye, LucideCheck,
    LucideX
} from 'lucide-vue-next'
import type {
    EventRegistration,
    RegistrationStatus
} from '~/interfaces/event-registration-interface'

interface Props {
    registrations?: EventRegistration[]
    pagination?: {
        page: number
        last_page: number
        total: number
    }
    isLoading?: boolean
    isUpdating?: boolean
    isExporting?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    refresh: []
    filter: [filters: { status?: string; search?: string; page?: number }]
    confirm: [registrationId: string]
    cancel: [registrationId: string]
    export: [exportType: 'all' | 'confirmed']
}>()

// Reactive data
const filters = ref({
    status: '',
    search: '',
    page: 1
})

const selectedRegistration = ref<EventRegistration | null>(null)
const showExportModal = ref(false)

// Computed properties
const totalCount = computed(() => props.registrations?.length || 0)

const confirmedCount = computed(() => {
    return props.registrations?.filter(r => r.status === 'CONFIRMED').length || 0
})

const pendingCount = computed(() => {
    return props.registrations?.filter(r => r.status === 'PENDING').length || 0
})

const cancelledCount = computed(() => {
    return props.registrations?.filter(r => r.status === 'CANCELLED').length || 0
})

const hasActiveFilters = computed(() => {
    return filters.value.status || filters.value.search
})

const paginationPages = computed(() => {
    if (!props.pagination) return []

    const pages = []
    const current = props.pagination.page
    const last = props.pagination.last_page

    for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
        pages.push(i)
    }

    return pages
})

// Methods
const getStatusBadgeClass = (status: RegistrationStatus) => {
    switch (status) {
        case 'CONFIRMED':
            return 'badge-success'
        case 'PENDING':
            return 'badge-warning'
        case 'CANCELLED':
            return 'badge-error'
        default:
            return 'badge-ghost'
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatFormValue = (value: any) => {
    if (Array.isArray(value)) {
        return value.join(', ')
    }
    return String(value)
}

const viewRegistration = (registration: EventRegistration) => {
    selectedRegistration.value = registration
}

const confirmRegistration = (registrationId: string) => {
    emit('confirm', registrationId)
}

const cancelRegistration = (registrationId: string) => {
    emit('cancel', registrationId)
}

const applyFilters = () => {
    emit('filter', {
        status: filters.value.status || undefined,
        search: filters.value.search || undefined,
        page: 1
    })
}

const clearFilters = () => {
    filters.value.status = ''
    filters.value.search = ''
    filters.value.page = 1
    applyFilters()
}

const changePage = (page: number) => {
    filters.value.page = page
    emit('filter', {
        status: filters.value.status || undefined,
        search: filters.value.search || undefined,
        page
    })
}

const exportRegistrations = () => {
    emit('export', 'all')
}

const exportWithFilter = (exportType: 'all' | 'confirmed') => {
    showExportModal.value = false
    emit('export', exportType)
}
</script>
