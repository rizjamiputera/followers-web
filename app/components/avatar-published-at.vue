<template>
    <div class="w-full flex flex-wrap justify-between gap-2">
        <div class="flex items-center gap-1">
            <LazyAvatar v-if="data.author && data.author.avatar_md" :avatar="data.author.avatar_md"
                :name="data.author.name" :class="avatar_class" />
            {{ data.author?.name }}
        </div>
        <div class="flex items-center gap-1">
            <LucideClock :size="icon_size" /> {{ dayjs(data.publishedAt).format('D MMM HH:mm') }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideClock } from 'lucide-vue-next';
import type { Article } from '~/interfaces/article-interface';

withDefaults(
    defineProps<{
        data: Article
        avatar_class?: string
        icon_size?: number
    }>(),
    {
        avatar_class: '',
        icon_size: 14
    }
)
</script>

<style></style>
