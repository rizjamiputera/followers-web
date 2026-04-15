<template>
    <Modal :show="_show" @close="emit('close')">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4 text-red-600">Hapus Kategori</h3>
            <p class="mb-4">
                Yakin hapus kategori "<strong>{{ data.name }}</strong>"?
            </p>
            <div v-if="(data._count?.articles ?? 0) + (data._count?.events ?? 0) > 0" class="alert alert-warning mb-4">
                <LucideAlertTriangle class="h-4 w-4" />
                <span>
                    Kategori ini digunakan oleh
                    {{ (data._count?.articles ?? 0) + (data._count?.events ?? 0) }} konten.
                    Setelah dihapus, konten tersebut tidak akan memiliki kategori.
                </span>
            </div>
            <div class="flex justify-end gap-2">
                <Button @click="emit('close')" class="btn-ghost">Batal</Button>
                <Button @click="deleteCategory" class="btn-error" :disabled="isDeleting">
                    <span v-if="isDeleting" class="loading loading-spinner loading-xs"></span>
                    Hapus
                </Button>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { LucideAlertTriangle } from 'lucide-vue-next';
import type { Category } from '~/interfaces/category-interface';

const emit = defineEmits(['close']);
const props = defineProps<{
    data: Category
    show: boolean
}>();

const _show = ref(false);
watchEffect(() => { _show.value = props.show; });

const CategoriesStore = useCategoriesStore();
const isDeleting = ref(false);

const deleteCategory = async () => {
    try {
        isDeleting.value = true;
        await Api.delete('/v1/categories/' + props.data.id);
        toastSuccess('Kategori berhasil dihapus!');
        await CategoriesStore.fetch();
        emit('close');
    } catch (error) {
        toastError(error);
    } finally {
        isDeleting.value = false;
    }
};
</script>
