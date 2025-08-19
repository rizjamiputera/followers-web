<template>
    <NuxtLink :to prefetch-on="interaction" class="button-link btn">
        <slot />
    </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps<{
    to: string
}>();

// Button attributes
// const buttonAttrs = computed(() => ({
//     type: props.type ?? 'button',
//     disabled: props.disabled || props.loading,
// }));
</script>

<style scoped>
@reference "@/assets/css/main.css";

.button-link {
    @apply rounded-full gap-2 overflow-hidden shadow-none text-nowrap font-medium;
}
</style>
