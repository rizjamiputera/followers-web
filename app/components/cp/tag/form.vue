<template>
    <Modal :show="_show" @close="close">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">
                <!-- {{ showEditModal ? 'Edit Tag' : 'Create New Tag' }} -->
                {{ data ? 'Edit Tag' : 'Create New Tag' }}
            </h3>

            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="label">
                        <span class="label-text">Tag Name *</span>
                    </label>
                    <Input v-model="formData.name" placeholder="Enter tag name..." class="input-bordered w-full"
                        required maxlength="100" />
                </div>

                <div v-if="false">
                    <label class="label">
                        <span class="label-text">Color (Optional)</span>
                    </label>
                    <div class="flex items-center gap-3">
                        <input type="color" v-model="formData.color"
                            class="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
                        <Input v-model="formData.color" placeholder="#FF5733" class="input-bordered flex-1"
                            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                            title="Please enter a valid hex color (e.g., #FF5733)" />
                        <Button type="button" @click="formData.color = ''" class="btn-sm btn-ghost" title="Clear color">
                            <LucideX class="h-4 w-4" />
                        </Button>
                    </div>
                    <div class="label">
                        <span class="label-text-alt text-gray-500">
                            Leave empty for no color or enter a hex color code
                        </span>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-4">
                    <Button type="button" @click="close" class="btn-ghost">
                        Cancel
                    </Button>
                    <Button type="submit" class="btn-green" :disabled="isSubmitting || !formData.name.trim()">
                        <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                        {{ data ? 'Update Tag' : 'Create Tag' }}
                    </Button>
                </div>
            </form>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { LucideX } from 'lucide-vue-next';
import type { CreateTagDto, Tag, UpdateTagDto } from '~/interfaces/content-interface';

const emit = defineEmits(['close', 'updated']);
const props = defineProps<{
    data: Tag | null
    show: boolean
}>()

const _show = ref<boolean>(false);
const formData = ref<CreateTagDto & { id?: string }>({
    name: '',
    color: ''
})

watchEffect(() => {
    _show.value = props.show;

    formData.value.name = props.data?.name ?? '';
    formData.value.color = props.data?.color ?? '';
})

const TagsStore = useTagsStore();
const { get, create, update } = TagsStore;

const isSubmitting = ref(false)


const submitForm = async () => {
    try {
        isSubmitting.value = true

        const data: CreateTagDto | UpdateTagDto = {
            name: formData.value.name.trim(),
            color: formData.value.color?.trim() || undefined
        }

        // if (showEditModal.value && editingTag.value) {
        if (props.data) {
            await update(props.data.id, data)
            toastSuccess('Tag updated successfully!')
        } else {
            await create(data as CreateTagDto)
            toastSuccess('Tag created successfully!')
        }

        close();
        await get()
    } catch (error) {
        console.error('Failed to save tag:', error)
        toastError('Failed to save tag. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

const close = () => {
    formData.value = {
        name: '',
        color: ''
    };

    emit('close');
}
</script>

<style></style>
