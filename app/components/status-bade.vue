<template>
    <div class="badge badge-sm rounded-full text-nowrap" :class="contentStatusBadgeColor(status)">
        {{ status.replace('_', ' ') }}
    </div>
</template>

<script lang="ts" setup>
import type { ContentStatus } from '~/interfaces/article-interface';

defineProps<{
    status: ContentStatus
}>()

</script>

<style></style>
