<template>
    <div class="stat">
        <div class="stat-figure text-primary">
            <component :is="icon" class="h-6 w-6" />
        </div>
        <div class="stat-title">{{ label }}</div>
        <div class="stat-value text-primary text-2xl">{{ value }}</div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    icon: any
    label: string
    value: string
}>()
</script>

<style></style>
