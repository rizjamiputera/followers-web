<template>
    <LazyModal v-if="show" :show @close="$emit('close')">
        <div class="flex flex-col gap-4">
            <div>Yakin reject {{ type == 'article' ? 'artikel' : 'event' }} ini?</div>

            <Textarea label="Catatan" placeholder="Catatan untuk penulis" v-model="note" />
        </div>

        <div class="modal-action">
            <Button @click="$emit('close')" :disabled="isSubmitting">No</Button>

            <!-- publish -->
            <Button @click="submit" :disabled="isSubmitting" class="btn-warning">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Reject
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

const note = ref<string>('');
const isSubmitting = ref<boolean>(false);
const submit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true
    try {
        await Api.post(`/v1/${props.type}/reject/${props.dataId}`, { note: note.value });

        emits('submited');
    } finally {
        isSubmitting.value = true
    }
}

</script>

<style></style>
