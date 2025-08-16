<template>
    <NuxtLink :to prefetch-on="interaction"
        class="group flex items-start gap-4 p-4 lg:p-2 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/5 hover:border-green-main/30"
        @click="$emit('close')">
        <component :is="icon" class="side-sub-menu-icon w-6 mt-1 fill-[#F9F9F9]/70 group-hover:fill-green-main" />
        <div>
            <div class="side-sub-menu-title md:text-[16px] text-white-main group-hover:text-green-main mb-1">
                <slot name="title" />
            </div>
            <div class="text-xs md:text-sm font-light text-[#F9F9F9]/70">
                <slot name="desc" />
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
defineEmits(['close'])
defineProps<{
    icon: any
    to: string
}>()

</script>
