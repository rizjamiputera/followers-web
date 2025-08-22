<template>
    <LazyModal v-if="show" :show @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <div>Yakin publish {{ type == 'article' ? 'artikel' : 'event' }} ini?</div>
            <div class="text-sm h-[350px]">
                Atur Jadwal:
                <DateTimePicker v-model="publishedAt" />
            </div>
        </div>

        <div class="modal-action">
            <Button @click="$emit('close')" :disabled="isSubmitting">No</Button>

            <!-- publish -->
            <Button @click="submit" :disabled="isSubmitting" class="btn-green">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Publish
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

const publishedAt = ref<string | null>(null)
const isSubmitting = ref<boolean>(false);
const submit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true
    try {
        await Api.post(`/v1/${props.type}/publish/${props.dataId}`, { publishedAt: publishedAt.value });

        emits('submited');
    } finally {
        isSubmitting.value = true
    }
}
</script>

<style></style>
