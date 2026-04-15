<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between gap-2 items-center">
            <div class="main-title">Manajemen Kategori</div>
            <Button v-if="canCreate" @click="showCreateModal = true" class="btn-sm btn-green">
                <LucidePlus class="h-4 w-4" />
                Tambah Kategori
            </Button>
        </div>

        <div class="text-sm text-gray-600">
            Total: {{ categories.length }} kategori
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-2xl border border-green-main/5 bg-base-100">
            <table class="table">
                <thead>
                    <tr>
                        <th>Urutan</th>
                        <th>Nama</th>
                        <th>Slug</th>
                        <th class="text-center">Artikel</th>
                        <th class="text-center">Event</th>
                        <th class="text-center">Di Beranda</th>
                        <th v-if="canEdit || canDelete" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!isLoading && categories.length === 0">
                        <td colspan="7" class="text-center text-green-main font-light">
                            Belum ada kategori
                        </td>
                    </tr>
                    <tr v-for="cat in categories" :key="cat.id">
                        <td class="text-center w-16">
                            <span class="badge badge-ghost">{{ cat.sortOrder }}</span>
                        </td>
                        <td>
                            <div class="font-medium">{{ cat.name }}</div>
                            <div v-if="cat.description" class="text-xs text-gray-400 line-clamp-1">
                                {{ cat.description }}
                            </div>
                        </td>
                        <td>
                            <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ cat.slug }}</code>
                        </td>
                        <td class="text-center">
                            <span class="badge badge-ghost">{{ cat._count?.articles ?? 0 }}</span>
                        </td>
                        <td class="text-center">
                            <span class="badge badge-ghost">{{ cat._count?.events ?? 0 }}</span>
                        </td>
                        <td class="text-center">
                            <button v-if="canEdit" @click="toggleShowOnHome(cat)"
                                :class="cat.showOnHome ? 'badge-success' : 'badge-ghost'"
                                class="badge cursor-pointer hover:opacity-80 transition-opacity">
                                {{ cat.showOnHome ? 'Ya' : 'Tidak' }}
                            </button>
                            <span v-else :class="cat.showOnHome ? 'badge-success' : 'badge-ghost'" class="badge">
                                {{ cat.showOnHome ? 'Ya' : 'Tidak' }}
                            </span>
                        </td>
                        <td v-if="canEdit || canDelete" class="text-center">
                            <div class="flex gap-1 justify-center">
                                <Button v-if="canEdit" @click="openEdit(cat)" class="btn-sm btn-outline-green">
                                    <LucidePencilLine class="h-3 w-3" />
                                    Edit
                                </Button>
                                <Button v-if="canDelete" @click="openDelete(cat)" class="btn-sm btn-outline-red">
                                    <LucideTrash2 class="h-3 w-3 stroke-error" />
                                    Hapus
                                </Button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <LazyCpCategoryForm v-if="showCreateModal || showEditModal"
        :show="showCreateModal || showEditModal"
        :data="editingCategory"
        @close="closeModals" />

    <LazyCpCategoryRemove v-if="showDeleteModal && categoryToDelete"
        :show="showDeleteModal"
        :data="categoryToDelete"
        @close="showDeleteModal = false" />
</template>

<script lang="ts" setup>
import { LucidePlus, LucidePencilLine, LucideTrash2 } from 'lucide-vue-next';
import type { Category } from '~/interfaces/category-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.ARTICLE, Permission.READ)) {
                return navigateTo('/cp');
            }
        },
    ],
});

const AuthStore = useAuthStore();
const canCreate = computed(() => AuthStore.can(Module.ARTICLE, Permission.CREATE));
const canEdit = computed(() => AuthStore.can(Module.ARTICLE, Permission.EDIT));
const canDelete = computed(() => AuthStore.can(Module.ARTICLE, Permission.DELETE));

const CategoriesStore = useCategoriesStore();
const { categories } = storeToRefs(CategoriesStore);

const isLoading = ref(false);

const load = async () => {
    isLoading.value = true;
    await CategoriesStore.fetch();
    isLoading.value = false;
};

onMounted(load);

// Modals
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editingCategory = ref<Category | null>(null);
const categoryToDelete = ref<Category | null>(null);

const openEdit = (cat: Category) => {
    editingCategory.value = cat;
    showEditModal.value = true;
};

const openDelete = (cat: Category) => {
    categoryToDelete.value = cat;
    showDeleteModal.value = true;
};

const closeModals = () => {
    showCreateModal.value = false;
    showEditModal.value = false;
    editingCategory.value = null;
};

const toggleShowOnHome = async (cat: Category) => {
    try {
        await Api.patch('/v1/categories/' + cat.id, { showOnHome: !cat.showOnHome });
        await CategoriesStore.fetch();
    } catch (error) {
        toastError(error);
    }
};
</script>
