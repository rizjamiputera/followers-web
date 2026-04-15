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
                <span v-if="authorTags.length" class="ml-2 badge badge-warning badge-sm">
                    {{ authorTags.length }} nama penulis
                </span>
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
                        <th>Name</th>
                        <th>Slug</th>
                        <th class="text-center">Content Count</th>
                        <th v-if="canEdit || canDelete" class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredTags.length === 0 && !isLoading">
                        <td :colspan="canEdit || canDelete ? 4 : 3" class="text-center text-green-main font-light">
                            {{ search ? 'No tags found matching your search' : 'No tags available' }}
                        </td>
                    </tr>
                    <tr v-for="tag in filteredTags" :key="tag.id"
                        :class="isAuthorTag(tag) ? 'bg-warning/5' : ''">
                        <td>
                            <div class="flex items-center gap-2 capitalize">
                                <span class="font-medium">{{ tag.name }}</span>
                                <span v-if="isAuthorTag(tag)" class="badge badge-warning badge-xs">nama penulis</span>
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
                                <Button v-if="canDelete" @click="openMergeModal(tag)" class="btn-sm btn-outline btn-sm">
                                    <LucideGitMerge class="h-3 w-3" />
                                    Gabung
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
    <LazyCpTagForm v-if="showCreateModal || showEditModal" :show="showCreateModal || showEditModal" @close="closeModals"
        :data="editingTag" />

    <!-- Merge Modal -->
    <LazyCpTagMerge v-if="showMergeModal && mergingTag" :show="showMergeModal" :source="mergingTag" :tags="tags"
        @close="showMergeModal = false" />

    <!-- Delete Confirmation Modal -->
    <LazyCpTagRemove v-if="showDeleteModal && tagToDelete" :show="showDeleteModal" :data="tagToDelete"
        @close="showDeleteModal = false" />
</template>

<script lang="ts" setup>
import {
    LucidePlus,
    LucideTrash2,
    LucidePencilLine,
    LucideGitMerge,
} from 'lucide-vue-next'
import type { Tag, CreateTagDto } from '~/interfaces/content-interface'
import { Module, Permission } from '~/interfaces/user-interface'

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!(auth.can(Module.ARTICLE, Permission.CREATE) || auth.can(Module.EVENT, Permission.CREATE))) {
                return navigateTo('/cp')
            }
        }
    ]
})

// Auth and permissions
const AuthStore = useAuthStore()
const canCreate = computed(() => AuthStore.can(Module.ARTICLE, Permission.CREATE))
const canEdit = computed(() => AuthStore.can(Module.ARTICLE, Permission.EDIT))
const canDelete = computed(() => AuthStore.can(Module.ARTICLE, Permission.DELETE))

// Data
const TagsStore = useTagsStore();
const { tags, search, filteredTags, isLoading } = storeToRefs(TagsStore);
const { get } = TagsStore;

// Author tag detection: load usernames and flag tags that match
const usernames = ref<string[]>([]);
const loadUsernames = async () => {
    try {
        const res = await Api.get('/v1/creator?limit=500') as any;
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        usernames.value = list.map((u: any) => u.username).filter(Boolean);
    } catch { /* non-critical */ }
};

const isAuthorTag = (tag: Tag) =>
    usernames.value.includes(tag.slug) || usernames.value.includes(tag.name?.toLowerCase().replace(/\s+/g, '-'));

const authorTags = computed(() => tags.value.filter(isAuthorTag));

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showMergeModal = ref(false)

const formData = ref<CreateTagDto & { id?: string }>({ name: '', color: '' })
const editingTag = ref<Tag | null>(null)
const tagToDelete = ref<Tag | null>(null)
const mergingTag = ref<Tag | null>(null)

const openEditModal = (tag: Tag) => {
    editingTag.value = tag
    showEditModal.value = true
}

const openMergeModal = (tag: Tag) => {
    mergingTag.value = tag
    showMergeModal.value = true
}

const closeModals = () => {
    showCreateModal.value = false
    showEditModal.value = false
    editingTag.value = null
    formData.value = { name: '', color: '' }
}

const confirmDelete = (tag: Tag) => {
    tagToDelete.value = tag
    showDeleteModal.value = true
}

onMounted(async () => {
    await get();
    await loadUsernames();
});
</script>

<style>
/* Custom styles if needed */
</style>
