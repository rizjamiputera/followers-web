<template>
    <LazyModal v-if="show" :show :max-width="maxWidth" @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <div class="font-semibold">{{ title }}</div>
            <div v-if="message" class="text-sm text-gray-500">{{ message }}</div>
            <slot />
        </div>

        <div class="modal-action">
            <Button type="button" class="btn-ghost" :disabled="loading" @click="$emit('close')">
                {{ cancelText }}
            </Button>
            <Button type="button" :class="confirmClass" :disabled="loading" @click="$emit('confirm')">
                <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                {{ confirmText }}
            </Button>
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
defineEmits(['close', 'confirm']);

withDefaults(defineProps<{
    show: boolean
    title: string
    message?: string
    confirmText?: string
    cancelText?: string
    confirmClass?: string
    maxWidth?: string
    loading?: boolean
}>(), {
    confirmText: 'Ya',
    cancelText: 'Batal',
    confirmClass: 'btn-green',
    maxWidth: 'max-w-md',
    loading: false,
});
</script>
