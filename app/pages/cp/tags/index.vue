<template>
    <div ref="sectionRef" class="flex flex-col gap-4">
        <div class="flex justify-between gap-2 items-center">
            <div class="main-title">Tag Management</div>
            <Button v-if="canCreate" @click="showCreateModal = true" class="btn-sm btn-green">
                <LucidePlus class="h-4 w-4" />
                Add Tag
            </Button>
        </div>

        <div class="flex justify-between gap-4">
            <div class="text-sm text-gray-600">
                Total tags: {{ tags.length }}
            </div>

            <div class="flex-1 flex gap-3 justify-end">
                <Input v-model="search" placeholder="Search tags..." class="input-sm max-w-xs" />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Tags Table -->
        <div class="overflow-x-auto rounded-2xl border border-green-main/5 bg-base-100">
            <table class="table">
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th class="text-center">Content Count</th>
                        <th v-if="canEdit || canDelete" class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredTags.length === 0 && !isLoading">
                        <td :colspan="canEdit || canDelete ? 6 : 5" class="text-center text-green-main font-light">
                            {{ search ? 'No tags found matching your search' : 'No tags available' }}
                        </td>
                    </tr>
                    <tr v-for="tag in filteredTags" :key="tag.id">
                        <td>
                            <div class="flex items-center gap-2">
                                <div v-if="tag.color" class="w-6 h-6 rounded border border-gray-200"
                                    :style="{ backgroundColor: tag.color }"></div>
                                <div v-else class="w-6 h-6 rounded border border-gray-200 bg-gray-100">
                                    <span class="text-xs text-gray-400 flex items-center justify-center h-full">-</span>
                                </div>
                                <span v-if="tag.color" class="text-xs text-gray-600">{{ tag.color }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center gap-2 capitalize">
                                <span class="font-medium">{{ tag.name }}</span>
                            </div>
                        </td>
                        <td>
                            <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ tag.slug }}</code>
                        </td>
                        <td class="text-center">
                            <span class="badge badge-ghost">{{ tag._count?.contents || 0 }}</span>
                        </td>
                        <td v-if="canEdit || canDelete" class="text-center">
                            <div class="flex gap-1 justify-center">
                                <Button v-if="canEdit" @click="openEditModal(tag)" class="btn-sm btn-outline-green">
                                    <LucidePencilLine class="h-3 w-3" />
                                    Edit
                                </Button>
                                <Button v-if="canDelete" @click="confirmDelete(tag)" class="btn-sm btn-outline-red">
                                    <LucideTrash2 class="h-3 w-3 stroke-error" />
                                    Delete
                                </Button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-if="showCreateModal || showEditModal" :show="showCreateModal || showEditModal" @close="closeModals">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">
                {{ showEditModal ? 'Edit Tag' : 'Create New Tag' }}
            </h3>

            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="label">
                        <span class="label-text">Tag Name *</span>
                    </label>
                    <Input v-model="formData.name" placeholder="Enter tag name..." class="input-bordered w-full"
                        required maxlength="100" />
                </div>

                <div>
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
                    <Button type="button" @click="closeModals" class="btn-ghost">
                        Cancel
                    </Button>
                    <Button type="submit" class="btn-green" :disabled="isSubmitting || !formData.name.trim()">
                        <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                        {{ showEditModal ? 'Update Tag' : 'Create Tag' }}
                    </Button>
                </div>
            </form>
        </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-if="showDeleteModal" :show="showDeleteModal" @close="showDeleteModal = false">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4 text-red-600">Delete Tag</h3>
            <div v-if="tagToDelete">
                <p class="mb-4">
                    Are you sure you want to delete the tag "<strong>{{ tagToDelete.name }}</strong>"?
                </p>
                <div v-if="tagToDelete._count && tagToDelete._count.contents > 0" class="alert alert-warning mb-4">
                    <LucideAlertTriangle class="h-4 w-4" />
                    <span>
                        This tag is currently used in {{ tagToDelete._count.contents }} content items.
                        Deleting it will remove it from all associated content.
                    </span>
                </div>
                <div class="flex justify-end gap-2">
                    <Button @click="showDeleteModal = false" class="btn-ghost">
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
import {
    LucidePlus,
    LucideTrash2,
    LucideX,
    LucideAlertTriangle,
    LucidePencilLine
} from 'lucide-vue-next'
import type { Tag, CreateTagDto, UpdateTagDto } from '~/interfaces/content-interface'
import { Module, Permission } from '~/interfaces/user-interface'

definePageMeta({
    layout: 'control-panel'
})

// Auth and permissions
const AuthStore = useAuthStore()
const canCreate = computed(() => AuthStore.can(Module.ARTICLE, Permission.CREATE))
const canEdit = computed(() => AuthStore.can(Module.ARTICLE, Permission.EDIT))
const canDelete = computed(() => AuthStore.can(Module.ARTICLE, Permission.DELETE))

// Data
const TagsStore = useTagsStore();
const { tags, search, filteredTags, isLoading } = storeToRefs(TagsStore);
const { get, create, update, remove } = TagsStore;

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Form
const formData = ref<CreateTagDto & { id?: string }>({
    name: '',
    color: ''
})
const isSubmitting = ref(false)
const editingTag = ref<Tag | null>(null)

// Delete
const tagToDelete = ref<Tag | null>(null)
const isDeleting = ref(false)

const openEditModal = (tag: Tag) => {
    editingTag.value = tag
    formData.value = {
        id: tag.id,
        name: tag.name,
        color: tag.color || ''
    }
    showEditModal.value = true
}

const closeModals = () => {
    showCreateModal.value = false
    showEditModal.value = false
    editingTag.value = null
    formData.value = { name: '', color: '' }
}

const submitForm = async () => {
    try {
        isSubmitting.value = true

        const data: CreateTagDto | UpdateTagDto = {
            name: formData.value.name.trim(),
            color: formData.value.color?.trim() || undefined
        }

        if (showEditModal.value && editingTag.value) {
            await update(editingTag.value.id, data)
            toastSuccess('Tag updated successfully!')
        } else {
            await create(data as CreateTagDto)
            toastSuccess('Tag created successfully!')
        }

        closeModals()
        await get()
    } catch (error) {
        console.error('Failed to save tag:', error)
        toastError('Failed to save tag. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = (tag: Tag) => {
    tagToDelete.value = tag
    showDeleteModal.value = true
}

const deleteTag = async () => {
    if (!tagToDelete.value) return

    try {
        isDeleting.value = true
        await remove(tagToDelete.value.id)
        toastSuccess('Tag deleted successfully!')
        showDeleteModal.value = false
        tagToDelete.value = null
        await get()
    } catch (error) {
        console.error('Failed to delete tag:', error)
        toastError('Failed to delete tag. Please try again.')
    } finally {
        isDeleting.value = false
    }
}

// Initialize
onMounted(get)
</script>

<style>
/* Custom styles if needed */
</style>
