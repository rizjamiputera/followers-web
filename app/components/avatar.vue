<template>
    <LazyImage v-if="avatar && name" :src="avatar" :alt="name"
        class="rounded-full bg-cover bg-center bg-green-main/30" />
    <div v-else class="rounded-full bg-green-main/30 flex items-center justify-center">
        <LucideUser2 :size="14" />
    </div>
</template>

<script lang="ts" setup>
withDefaults(
    defineProps<{
        avatar?: string
        name?: string
    }>(),
    {}
)
</script>
