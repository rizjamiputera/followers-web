<template>
    <div class="featured-carousel relative" v-if="items && items.length > 0">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
            <div class="flex gap-2">
                <button @click="prevSlide" :disabled="currentIndex === 0"
                    class="btn btn-circle btn-sm btn-outline" :class="{ 'opacity-50': currentIndex === 0 }">
                    <LucideChevronLeft class="h-4 w-4" />
                </button>
                <button @click="nextSlide" :disabled="currentIndex >= items.length - itemsPerView"
                    class="btn btn-circle btn-sm btn-outline"
                    :class="{ 'opacity-50': currentIndex >= items.length - itemsPerView }">
                    <LucideChevronRight class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Carousel Container -->
        <div class="carousel-container overflow-hidden">
            <div class="carousel-track flex transition-transform duration-500 ease-in-out"
                :style="`transform: translateX(-${currentIndex * (100 / itemsPerView)}%)`">
                <div v-for="(item, index) in items" :key="item.id"
                    class="carousel-item flex-shrink-0"
                    :style="`width: ${100 / itemsPerView}%; padding-right: 1rem`">
                    
                    <!-- Article Card -->
                    <div v-if="getItemType(item) === 'article'" class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow h-full">
                        <figure class="aspect-video overflow-hidden">
                            <NuxtLink :to="`/articles/${item.slug}`">
                                <img v-if="item.image" 
                                     :src="item.image" 
                                     :alt="item.title"
                                     class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <LucideFileText class="h-16 w-16 text-white opacity-50" />
                                </div>
                            </NuxtLink>
                        </figure>
                        
                        <div class="card-body p-4">
                            <h3 class="card-title text-base line-clamp-2 mb-2">
                                <NuxtLink :to="`/articles/${item.slug}`" class="hover:text-primary">
                                    {{ item.title }}
                                </NuxtLink>
                            </h3>
                            <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                                {{ item.excerpt }}
                            </p>
                            
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <div class="flex items-center gap-2">
                                    <Avatar :src="item.author?.avatar" :name="item.author?.name" class="w-4 h-4" />
                                    <span>{{ item.author?.name }}</span>
                                </div>
                                <time :datetime="item.publishedAt">
                                    {{ formatDate(item.publishedAt) }}
                                </time>
                            </div>
                        </div>
                    </div>

                    <!-- Event Card -->
                    <div v-else-if="getItemType(item) === 'event'" class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow h-full">
                        <figure class="aspect-video overflow-hidden">
                            <NuxtLink :to="`/events/${item.slug}`">
                                <img v-if="item.image" 
                                     :src="item.image" 
                                     :alt="item.title"
                                     class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                <div v-else class="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                                    <LucideCalendar class="h-16 w-16 text-white opacity-50" />
                                </div>
                            </NuxtLink>
                        </figure>
                        
                        <div class="card-body p-4">
                            <h3 class="card-title text-base line-clamp-2 mb-2">
                                <NuxtLink :to="`/events/${item.slug}`" class="hover:text-primary">
                                    {{ item.title }}
                                </NuxtLink>
                            </h3>
                            <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                                {{ item.excerpt }}
                            </p>
                            
                            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <div class="flex items-center gap-1">
                                    <LucideCalendar class="h-3 w-3" />
                                    <time :datetime="item.start_at">
                                        {{ formatEventDate(item.start_at) }}
                                    </time>
                                </div>
                                <div v-if="item.location" class="flex items-center gap-1">
                                    <LucideMapPin class="h-3 w-3" />
                                    <span class="truncate max-w-20">{{ item.location }}</span>
                                </div>
                            </div>

                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <div class="flex items-center gap-2">
                                    <Avatar :src="item.author?.avatar" :name="item.author?.name" class="w-4 h-4" />
                                    <span>{{ item.author?.name }}</span>
                                </div>
                                <div v-if="item.registeredCount !== undefined" class="flex items-center gap-1">
                                    <LucideUsers class="h-3 w-3" />
                                    <span>{{ item.registeredCount }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dots Indicator -->
        <div class="flex justify-center mt-4 gap-2">
            <button v-for="(_, index) in Math.ceil(items.length / itemsPerView)" 
                    :key="index"
                    @click="goToSlide(index)"
                    class="w-2 h-2 rounded-full transition-all"
                    :class="Math.floor(currentIndex / itemsPerView) === index ? 'bg-primary' : 'bg-gray-300'">
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { 
    LucideChevronLeft, 
    LucideChevronRight, 
    LucideFileText, 
    LucideCalendar, 
    LucideMapPin,
    LucideUsers 
} from 'lucide-vue-next'

interface FeaturedItem {
    id: string
    slug: string
    title: string
    excerpt: string
    image?: string
    publishedAt?: string
    start_at?: string // for events
    location?: string // for events
    registeredCount?: number // for events
    author?: {
        name: string
        avatar?: string
    }
}

interface Props {
    items: FeaturedItem[]
    title: string
    itemsPerView?: number
}

const props = withDefaults(defineProps<Props>(), {
    itemsPerView: 3
})

// Reactive data
const currentIndex = ref(0)

// Responsive items per view
const itemsPerView = computed(() => {
    // Adjust based on screen size if needed
    return props.itemsPerView
})

// Methods
const nextSlide = () => {
    if (currentIndex.value < props.items.length - itemsPerView.value) {
        currentIndex.value += 1
    }
}

const prevSlide = () => {
    if (currentIndex.value > 0) {
        currentIndex.value -= 1
    }
}

const goToSlide = (index: number) => {
    currentIndex.value = index * itemsPerView.value
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getItemType = (item: FeaturedItem): 'article' | 'event' => {
    return item.start_at ? 'event' : 'article'
}

// Auto-play functionality (optional)
let autoplayInterval: NodeJS.Timeout | null = null

const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
        if (currentIndex.value >= props.items.length - itemsPerView.value) {
            currentIndex.value = 0
        } else {
            nextSlide()
        }
    }, 5000) // 5 seconds
}

const stopAutoplay = () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval)
        autoplayInterval = null
    }
}

onMounted(() => {
    // Uncomment to enable autoplay
    // startAutoplay()
})

onUnmounted(() => {
    stopAutoplay()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.carousel-item {
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .carousel-item {
        width: 100% !important;
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    .carousel-item {
        width: 50% !important;
    }
}
</style>