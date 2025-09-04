<template>
    <div class="stat bg-base-100 shadow rounded-lg relative">
        <component :is="icon" class="h-5 w-5 sm:h-8 sm:w-8 absolute top-4 right-4" :class="colorClass" />
        <!-- <div
            class="stat-figure text-primary flex-shrink-0 sm:block absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto">
        </div> -->
        <div class="stat-title text-xs sm:text-sm pr-8 sm:pr-0">{{ label }}</div>
        <div class="stat-value" :class="colorClass">{{ value1 }}</div>
        <div class="stat-desc text-xs">{{ value2 }}</div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    icon: any
    colorClass?: string
    label: string
    value1: string
    value2: string
}>()
</script>

<style></style>
