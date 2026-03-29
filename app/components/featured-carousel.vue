<template>
    <template v-if="items && items.length > 0">
        <div class="relative">
            <Carousel ref="carouselRef" v-bind="carouselConfig" class="w-full items-start">
                <Slide v-for="item in items" :key="item.id" class="!items-start">
                    <div class="carousel__item w-full flex flex-col items-start gap-2">
                        <NuxtLink :to="(!item.location ? '/read/' : '/event/') + item.slug"
                            class="w-full h-full bg-cover bg-center aspect-video rounded-lg md:rounded-3xl overflow-hidden"
                            :style="{ backgroundImage: `url(${item.image})` }">
                        </NuxtLink>
                        <div class="w-full h-full flex flex-col justify-end text-gray-900">
                            <div class="text-xs sm:text-sm md:text-md line-clamp-2 ">
                                {{ item.title }}
                            </div>
                            <div v-if="false" class="text-sm font-light max-sm:truncate">{{ item.excerpt }}</div>

                            <!-- <template v-if="item.location && item.start_at"> -->
                            <template v-if="false">
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
                    </div>
                </Slide>

                <template #addons>
                    <Navigation />
                </template>
            </Carousel>
            <Pagination :carousel="carouselRef" class="!-bottom-2" />
        </div>
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

const carouselRef = ref<InstanceType<typeof Carousel>>()

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

<style>
.carousel__pagination button {
    border-radius: 100%;
    height: 6px;
    width: 6px;
}
</style>
