<template>
    <template v-if="items && items.length > 0">
        <Carousel v-bind="carouselConfig" class="w-full !h-full">
            <Slide v-for="item in items" :key="item.id">
                <NuxtLink :to="(!item.location ? '/read/' : '/event/') + item.slug"
                    class="carousel__item text-black w-full h-full bg-cover bg-center"
                    :style="{ backgroundImage: `url(${item.image})` }">

                    <div v-if="false"
                        class="bg-gradient-to-b from-black/0 to-black/50 w-full h-full flex flex-col justify-end p-6 md:p-10 text-white">
                        <div class="font-cinzel font-semibold tracking-widest">{{ item.title }}</div>
                        <div class="text-sm font-light max-sm:truncate">{{ item.excerpt }}</div>

                        <template v-if="item.location && item.start_at">
                            <div class="badge badge-sm badge-outline bg-black/50 border-white/50">
                                <LucideMapPin :size="14" /> {{ item.location }}
                            </div>
                            <div class="flex gap-1 mt-1">
                                <div class="badge badge-sm badge-outline bg-black/50 border-white/50">
                                    <LucideCalendar :size="14" /> {{ dayjs(item.start_at).format('DD MMMM YYYY') }}
                                </div>
                                <div class="badge badge-sm badge-outline bg-black/50 border-white/50">
                                    <LucideClock :size="14" />
                                    {{ formatTime(item.start_at) }} {{ userTimezone() }}
                                </div>
                            </div>
                        </template>
                    </div>
                </NuxtLink>
            </Slide>

            <template #addons>
                <Navigation />
                <Pagination />
            </template>
        </Carousel>
    </template>

</template>

<script lang="ts" setup>
import {
    LucideCalendar,
    LucideMapPin,
    LucideClock
} from 'lucide-vue-next'

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import dayjs from 'dayjs'

const carouselConfig = {
    itemsToShow: 1,
    wrapAround: true,
    autoplay: 5000
}

export interface FeaturedItem {
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
}

const props = withDefaults(defineProps<Props>(), {
})

onMounted(() => {
})

onUnmounted(() => {
})
</script>
