<template>
    <NuxtLink v-if="clickable" :to="`/tags/${tag.slug}`"
        class="badge badge-outline hover:badge-primary transition-colors cursor-pointer capitalize" :class="sizeClass">
        {{ tag.name }}
    </NuxtLink>
    <span v-else class="badge badge-outline border-gray-500/40 capitalize" :class="sizeClass">
        {{ tag.name }}
    </span>
</template>

<script setup lang="ts">
import type { Tag } from '~/interfaces/content-interface'

interface Props {
    tag: Tag
    clickable?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    clickable: true,
    size: 'sm'
})

const sizeClass = computed(() => {
    switch (props.size) {
        case 'xs': return 'badge-xs'
        case 'sm': return 'badge-sm'
        case 'md': return 'badge-md'
        case 'lg': return 'badge-lg'
        default: return 'badge-sm'
    }
})
</script>
