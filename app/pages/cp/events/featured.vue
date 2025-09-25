<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Featured Events</h1>
                <p class="text-gray-600">Manage events that appear in the featured carousel on homepage</p>
            </div>
        </div>

        <!-- Stats -->
        <div class="stats shadow w-full">
            <div class="stat">
                <div class="stat-title">Featured Events</div>
                <div class="stat-value text-primary">{{events.filter(e => e.isFeatured).length}}</div>
                <div class="stat-desc">Currently featured</div>
            </div>
            <div class="stat">
                <div class="stat-title">Total Published</div>
                <div class="stat-value">{{ events.length }}</div>
                <div class="stat-desc">Published events</div>
            </div>
        </div>

        <!-- Events List -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="card-title">Published Events</h2>
                    <div class="flex items-center gap-2">
                        <div class="form-control">
                            <input v-model="searchQuery" type="text" placeholder="Search events..."
                                class="input input-bordered input-sm w-64" />
                        </div>
                        <div class="form-control">
                            <select v-model="filterFeatured" class="select select-bordered select-sm">
                                <option value="">All Events</option>
                                <option value="true">Featured Only</option>
                                <option value="false">Not Featured</option>
                            </select>
                        </div>
                        <button @click="loadEvents" class="btn btn-sm btn-outline">
                            <LucideRefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
                        </button>
                    </div>
                </div>

                <div v-if="loading" class="flex justify-center py-8">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>

                <div v-else-if="filteredEvents.length === 0" class="text-center py-8 text-gray-500">
                    <LucideCalendar class="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No events found</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Author</th>
                                <th>Date & Location</th>
                                <th>Stats</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="event in paginatedEvents" :key="event.id">
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div class="avatar">
                                            <div class="mask mask-squircle w-12 h-12">
                                                <img v-if="event.image" :src="event.image" :alt="event.title" />
                                                <div v-else
                                                    class="bg-gradient-to-br from-green-500 to-blue-600 w-full h-full flex items-center justify-center">
                                                    <LucideCalendar class="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-semibold line-clamp-1">{{ event.title }}</div>
                                            <div class="text-sm opacity-70 line-clamp-1">{{ event.excerpt }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <div class="avatar avatar-xs">
                                            <Avatar :src="event.author?.avatar" :name="event.author?.name"
                                                class="w-6 h-6" />
                                        </div>
                                        <span class="text-sm">{{ event.author?.name }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="text-sm">
                                        <div class="flex items-center gap-1 mb-1">
                                            <LucideCalendar class="h-3 w-3" />
                                            <time :datetime="event.start_at">
                                                {{ formatEventDate(event.start_at) }}
                                            </time>
                                        </div>
                                        <div v-if="event.location" class="flex items-center gap-1 text-gray-600">
                                            <LucideMapPin class="h-3 w-3" />
                                            <span class="truncate">{{ event.location }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-4 text-xs">
                                        <div class="flex items-center gap-1">
                                            <LucideEye class="h-3 w-3" />
                                            <span>{{ event.stats?.visitCount || 0 }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <LucideUsers class="h-3 w-3" />
                                            <span>{{ event.registeredCount || 0 }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <input type="checkbox" :checked="event.isFeatured"
                                                @change="toggleFeatured(event)" :disabled="updating"
                                                class="checkbox checkbox-primary checkbox-sm" />
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <NuxtLink :to="`/event/${event.slug}`" target="_blank"
                                            class="btn btn-ghost btn-xs">
                                            <LucideExternalLink class="h-4 w-4" />
                                        </NuxtLink>
                                        <NuxtLink :to="`/cp/my-events/form?id=${event.id}`"
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
    LucideCalendar,
    LucideMapPin,
    LucideUsers,
    LucideEye,
    LucideExternalLink,
    LucideEdit
} from 'lucide-vue-next'
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.EVENT, Permission.READ)) {
                return navigateTo('/cp')
            }
        }
    ]
})

// Reactive data
const events = ref<any[]>([])
const loading = ref(false)
const updating = ref(false)
const searchQuery = ref('')
const filterFeatured = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredEvents = computed(() => {
    let filtered = events.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.excerpt.toLowerCase().includes(query) ||
            event.location?.toLowerCase().includes(query) ||
            event.author?.name.toLowerCase().includes(query)
        )
    }

    if (filterFeatured.value !== '') {
        const isFeatured = filterFeatured.value === 'true'
        filtered = filtered.filter(event => event.isFeatured === isFeatured)
    }

    return filtered
})

const totalPages = computed(() => {
    return Math.ceil(filteredEvents.value.length / itemsPerPage)
})

const paginatedEvents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredEvents.value.slice(start, end)
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
const loadEvents = async () => {
    loading.value = true
    try {
        const response = await Api.get('/v1/event?status=PUBLISHED&limit=1000&include=author,stats,registrations') as any
        events.value = response.data || []
    } catch (error) {
        console.error('Failed to load events:', error)
        // Add toast notification here if available
    } finally {
        loading.value = false
    }
}

const toggleFeatured = async (event: any) => {
    updating.value = true
    try {
        await Api.patch(`/v1/home-page/featured-events/${event.id}`, {
            isFeatured: !event.isFeatured
        })

        // Update local state
        event.isFeatured = !event.isFeatured

        // Show success message
        // Add toast notification here if available

    } catch (error) {
        console.error('Failed to update featured status:', error)
        // Add error toast here if available
    } finally {
        updating.value = false
    }
}

const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Load events on mount
onMounted(() => {
    loadEvents()
})

// SEO
useSeoMeta({
    title: 'Featured Events - Control Panel',
    description: 'Manage featured events for homepage carousel'
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
