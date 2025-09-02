<template>
    <LazyImage v-if="avatar && name" :src="avatar" :alt="name"
        class="rounded-full bg-cover bg-center bg-white w-full h-full" />
    <div v-else class="rounded-full bg-green-main/30 flex items-center justify-center">
        <SvgAuthUser class="w-full h-full" />
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
