<template>
    <NuxtLink :to="'/creator/' + user.username" class="flex-1 flex items-center gap-1">
        <LazyAvatar v-if="user.avatar_md" :avatar="user.avatar_md" :name="user.name" :class="avatar_width" />
        <div class="font-cinzel flex-1 line-clamp-1">
            {{ user.name }}
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import type { User } from '~/interfaces/user-interface';

withDefaults(
    defineProps<{
        user: User
        avatar_width?: string
    }>(),
    {
        avatar_width: 'w-12 h-12',
    }
)

</script>

<style></style>
