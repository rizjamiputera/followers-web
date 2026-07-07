<template>
    <button v-bind="buttonAttrs" class="btn">
        <slot />
    </button>
</template>
<!-- <div>
    <svg v-show="loading" class="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
    </svg>
</div> -->

<script lang="ts" setup>
const props = defineProps<{
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
}>();

// Button attributes
const buttonAttrs = computed(() => ({
    type: props.type ?? 'button',
    disabled: props.disabled || props.loading,
}));
</script>

<style scoped>
@reference "@/assets/css/main.css";

/* @apply rounded-full overflow-hidden shadow-none text-nowrap font-medium; */
button {
    @apply gap-2 overflow-hidden text-nowrap;
}

button:not(:disabled) {
    @apply cursor-pointer;
}

/* button>div {
    @apply flex justify-between gap-3;
} */
</style>
