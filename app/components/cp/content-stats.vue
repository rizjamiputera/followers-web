<template>
    <div class="flex items-center gap-x-3 text-xs text-gray-500 tabular-nums whitespace-nowrap">
        <span class="inline-flex items-center gap-1" title="Dibaca">
            <LucideEye :size="13" class="text-green-main/60" /> {{ stats?.readCount ?? 0 }}
        </span>
        <span class="inline-flex items-center gap-1" title="Suka">
            <LucideThumbsUp :size="13" class="text-green-main/60" /> {{ stats?.likeCount ?? 0 }}
        </span>
        <span v-if="!compact" class="inline-flex items-center gap-1" title="Tidak suka">
            <LucideThumbsDown :size="13" class="text-gray-400" /> {{ stats?.dislikeCount ?? 0 }}
        </span>
        <span v-if="!compact" class="inline-flex items-center gap-1" title="Komentar">
            <LucideMessageCircle :size="13" class="text-gray-400" /> {{ stats?.commentCount ?? 0 }}
        </span>
        <span class="inline-flex items-center gap-1" title="Dibagikan">
            <LucideShare2 :size="13" class="text-gray-400" /> {{ stats?.shareCount ?? 0 }}
        </span>
        <span v-if="!compact" class="inline-flex items-center gap-1" title="Bookmark">
            <LucideBookmark :size="13" class="text-gray-400" /> {{ stats?.bookmarkCount ?? 0 }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { LucideEye, LucideThumbsUp, LucideThumbsDown, LucideMessageCircle, LucideShare2, LucideBookmark } from 'lucide-vue-next';

defineProps<{
    stats?: {
        readCount?: number
        likeCount?: number
        dislikeCount?: number
        commentCount?: number
        shareCount?: number
        bookmarkCount?: number
    } | null
    compact?: boolean
}>();
</script>
