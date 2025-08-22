<template>
    <LazyModal v-if="show" :show="show" @close="$emit('close')">
        Yakin ajukan approval?
        <div class="modal-action">
            <Button @click="$emit('close')" :disabled="isSubmitting">No</Button>

            <Button @click="submit" :disabled="isSubmitting" class="btn-black">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Simpan
            </Button>
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
import { LucideLoader } from 'lucide-vue-next';

const emits = defineEmits(['close', 'submited'])
const props = defineProps<{
    type: 'article' | 'event'
    dataId: string
    show: boolean
}>()

const isSubmitting = ref<boolean>(false);
const submit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true
    try {
        await Api.post(`/v1/${props.type}/review/${props.dataId}`);

        emits('submited');
    } finally {
        isSubmitting.value = true
    }
}
</script>

<style></style>
