<template>
    <div class="flex max-md:flex-col md:items-center gap-5 md:gap-7 lg:gap-10 xl:gap-20"
        :class="reverse ? 'md:flex-row-reverse' : 'md:flex-row'">
        <div class="w-full md:w-6/10 lg:w-1/2">
            <slot />
        </div>

        <div class="w-full md:w-4/10 lg:w-1/2">
            <slot name="image" />
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    reverse?: boolean
}>()

</script>

<style></style>
