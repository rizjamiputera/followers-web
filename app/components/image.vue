<template>
    <div v-if="!fullImage" ref="target" class="transition-opacity duration-300 bg-green-main/30 bg-center"
        :class="[className, { 'opacity-0': !isLoaded }]" :style="isLoaded ? `background-image: url('${src}');` : ''">
        <slot />
    </div>
    <img v-else ref="target" class="transition-opacity duration-300 object-center"
        :class="[className, { 'opacity-0': !isLoaded }]" :src="isLoaded ? src : ''" :alt="alt || ''" />
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
    src: string
    className?: string
    fullImage?: boolean
    alt?: string
}>()

const { fullImage, alt } = toRefs(props)
const target = ref<HTMLElement>()
const isLoaded = ref(false)

const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = reject
        img.src = src
    })
}

const { stop } = useIntersectionObserver(
    target,
    async (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !isLoaded.value) {
            try {
                await preloadImage(props.src)
                isLoaded.value = true
                stop() // Stop observing once loaded
            } catch (error) {
                console.error('Failed to load image:', props.src, error)
            }
        }
    },
    {
        rootMargin: '50px',
        threshold: 0.1
    }
)
</script>
