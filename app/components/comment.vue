<template>
    <div class="flex gap-2 bg-white p-4 rounded-lg">
        <Avatar :avatar="comment.user?.avatar_md" :name="comment.user?.name" class="w-8 h-8" />
        <div class="flex-1">
            <div class="flex justify-between gap-2 items-end">
                <span class="font-semibold text-sm">{{ comment.user?.name || 'Anonymous' }}</span>
                <span class="text-xs">{{ dayjs(comment.createdAt).format('D-MMM-YY H:mm') }}</span>
            </div>
            <div class="text-xs">
                <span v-if="comment.mentioned" class="badge badge-sm badge-soft badge-success">
                    @{{ comment.mentioned.name }}
                </span>
                {{ comment.content }}
            </div>
            <div class="flex items-center gap-2 mt-1">
                <div class="flex items-center text-xs">
                    <button @click="" class="btn btn-xs btn-circle btn-ghost">
                        <LucideThumbsUp :size="14" />
                    </button>
                    180
                </div>
                <div class="flex items-center text-xs">
                    <button @click="" class="btn btn-xs btn-circle btn-ghost">
                        <LucideThumbsDown :size="14" />
                    </button>
                    180
                </div>
                <button @click="" class="btn btn-xs btn-circle btn-ghost">
                    <LucideThumbsDown :size="14" />
                </button>
                <button @click="" class="btn btn-xs rounded-full btn-ghost">
                    Reply
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideThumbsDown, LucideThumbsUp } from 'lucide-vue-next';
import type { Comment } from '~/interfaces/article-interface';

defineProps<{
    comment: Comment
}>()

</script>

<style></style>
