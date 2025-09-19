<template>
    <Modal :show="_show" @close="emit('close')">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4 text-red-600">Delete Tag</h3>
            <div>
                <p class="mb-4">
                    Are you sure you want to delete the tag "<strong class="capitalize">{{ data.name }}</strong>"?
                </p>
                <div v-if="data._count && data._count.contents > 0" class="alert alert-warning mb-4">
                    <LucideAlertTriangle class="h-4 w-4" />
                    <span>
                        This tag is currently used in {{ data._count.contents }} content items.
                        Deleting it will remove it from all associated content.
                    </span>
                </div>
                <div class="flex justify-end gap-2">
                    <Button @click="emit('close')" class="btn-ghost">
                        Cancel
                    </Button>
                    <Button @click="deleteTag" class="btn-error" :disabled="isDeleting">
                        <span v-if="isDeleting" class="loading loading-spinner loading-xs"></span>
                        Delete Tag
                    </Button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { LucideAlertTriangle } from 'lucide-vue-next';
import type { Tag } from '~/interfaces/content-interface';

const emit = defineEmits(['close', 'updated']);
const props = defineProps<{
    data: Tag
    show: boolean
}>()

const _show = ref<boolean>(false);

watchEffect(() => {
    _show.value = props.show;
})

const TagsStore = useTagsStore();
const { get, remove } = TagsStore;

const isDeleting = ref(false)
const deleteTag = async () => {
    try {
        isDeleting.value = true
        await remove(props.data.id)
        toastSuccess('Tag deleted successfully!')
        await get();

        emit('close')
    } catch (error) {
        console.error('Failed to delete tag:', error)
        toastError('Failed to delete tag. Please try again.')
    } finally {
        isDeleting.value = false
    }
}
</script>

<style></style>
