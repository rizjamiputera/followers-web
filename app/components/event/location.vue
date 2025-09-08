<template>
    <div class="badge badge-sm badge-outline-green bg-transparent max-w-full">
        <div class="max-w-full flex items-center gap-1">
            <LucideMapPin :size="14" />
            <span class="flex-1 truncate">
                <slot />
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { LucideMapPin } from 'lucide-vue-next';
</script>

<style></style>
