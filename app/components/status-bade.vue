<template>
    <div class="badge badge-sm rounded-full text-nowrap" :class="articleStatusBadgeColor(status)">
        {{ status.replace('_', ' ') }}
    </div>
</template>

<script lang="ts" setup>
import type { ArticleStatus } from '~/interfaces/article-interface';

defineProps<{
    status: ArticleStatus
}>()

</script>

<style></style>
