<template>
    <div class="flex gap-3 group">
        <Avatar :avatar="comment.user?.avatar_md" :name="comment.user?.name"
            :class="compact ? 'w-7 h-7 shrink-0' : 'w-9 h-9 shrink-0'" />
        <div class="flex-1 min-w-0">
            <div
                class="bg-gray-50 group-hover:bg-gray-100/80 transition-colors rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold text-sm text-gray-800">{{ comment.user?.name || 'Anonymous' }}</span>
                    <span class="text-xs text-gray-400">{{ getRelativeTime(comment.createdAt) }}</span>
                </div>
                <div class="text-sm text-gray-700 mt-0.5 break-words whitespace-pre-wrap leading-relaxed">
                    <span v-if="comment.mentioned" class="font-medium text-green-main">@{{ comment.mentioned.name }}</span>
                    {{ comment.comment }}
                </div>
            </div>
            <div v-if="user" class="flex items-center gap-4 mt-1 ml-3.5">
                <button v-if="!hideReply" type="button" @click="$emit('reply')"
                    class="text-xs font-semibold text-gray-400 hover:text-green-main transition-colors cursor-pointer">
                    Balas
                </button>
                <button v-if="canDelete" type="button" @click="$emit('delete')"
                    class="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                    Hapus
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Comment } from '~/interfaces/content-interface';
import { getRelativeTime } from '~/utils/get-relative-time';
import { Module, Permission } from '~/interfaces/user-interface';

const props = defineProps<{
    comment: Comment
    hideReply?: boolean
    compact?: boolean
}>()

defineEmits<{ reply: [], delete: [] }>()

const authStore = useAuthStore();
const { user } = authStore;

// Author can delete their own comment; admins/moderators can delete any.
const canDelete = computed(() => {
    if (!authStore.user) return false;
    return props.comment.user?.id === authStore.user.id
        || authStore.can(Module.COMMENT, Permission.DELETE);
});
</script>

<style></style>
