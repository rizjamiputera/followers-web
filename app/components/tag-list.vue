<template>
    <div v-if="tags && tags.length > 0" class="flex flex-wrap gap-2">
        <TagBadge
            v-for="tag in tags"
            :key="tag.id"
            :tag="tag"
            :clickable="clickable"
            :size="size"
        />
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/interfaces/content-interface'

interface Props {
    tags?: Tag[]
    clickable?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
    clickable: true,
    size: 'sm'
})
</script>