<template>
    <div class="flex items-center gap-3">
        <div class="avatar">
            <div class="mask mask-squircle w-12 h-12 bg-green-main/10 shrink-0">
                <img v-if="image" :src="image" :alt="title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-green-main/50">
                    <LucideFileText class="h-6 w-6" />
                </div>
            </div>
        </div>
        <div class="min-w-0">
            <div class="font-semibold text-gray-800 line-clamp-1">{{ title }}</div>
            <div v-if="excerpt" class="text-sm text-gray-500 line-clamp-1">{{ excerpt }}</div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { LucideFileText } from 'lucide-vue-next';

defineProps<{
    image?: string | null
    title?: string | null
    excerpt?: string | null
}>();
</script>
