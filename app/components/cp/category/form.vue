<template>
    <Modal :show="_show" @close="close">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">
                {{ data ? 'Edit Kategori' : 'Tambah Kategori' }}
            </h3>

            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="label"><span class="label-text">Nama *</span></label>
                    <Input v-model="formData.name" placeholder="Nama kategori..." class="input-bordered w-full"
                        required maxlength="100" />
                </div>

                <div>
                    <label class="label"><span class="label-text">Deskripsi</span></label>
                    <Textarea v-model="formData.description" placeholder="Deskripsi singkat (opsional)..." />
                </div>

                <div>
                    <label class="label"><span class="label-text">Urutan (sort order)</span></label>
                    <Input type="number" v-model.number="formData.sortOrder" class="input-bordered w-32" min="0" />
                </div>

                <div class="form-control">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" v-model="formData.showOnHome" class="checkbox checkbox-success" />
                        <span class="label-text">Tampilkan di Beranda</span>
                    </label>
                    <p class="text-xs text-gray-500 ml-9">
                        Aktifkan untuk menampilkan section kategori ini di halaman utama.
                    </p>
                </div>

                <div class="flex justify-end gap-2 pt-4">
                    <Button type="button" @click="close" class="btn-ghost">Batal</Button>
                    <Button type="submit" class="btn-green" :disabled="isSubmitting || !formData.name.trim()">
                        <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                        {{ data ? 'Simpan' : 'Buat Kategori' }}
                    </Button>
                </div>
            </form>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import type { Category } from '~/interfaces/category-interface';

const emit = defineEmits(['close']);
const props = defineProps<{
    data: Category | null
    show: boolean
}>();

const _show = ref(false);
const formData = ref({
    name: '',
    description: '',
    sortOrder: 0,
    showOnHome: false,
});

watchEffect(() => {
    _show.value = props.show;
    formData.value.name = props.data?.name ?? '';
    formData.value.description = props.data?.description ?? '';
    formData.value.sortOrder = props.data?.sortOrder ?? 0;
    formData.value.showOnHome = props.data?.showOnHome ?? false;
});

const CategoriesStore = useCategoriesStore();
const isSubmitting = ref(false);

const submitForm = async () => {
    try {
        isSubmitting.value = true;
        const payload = {
            name: formData.value.name.trim(),
            description: formData.value.description.trim() || undefined,
            sortOrder: formData.value.sortOrder,
            showOnHome: formData.value.showOnHome,
        };

        if (props.data) {
            await Api.patch('/v1/categories/' + props.data.id, payload);
            toastSuccess('Kategori berhasil diperbarui!');
        } else {
            await Api.post('/v1/categories', payload);
            toastSuccess('Kategori berhasil dibuat!');
        }

        await CategoriesStore.fetch();
        close();
    } catch (error) {
        toastError(error);
    } finally {
        isSubmitting.value = false;
    }
};

const close = () => {
    emit('close');
};
</script>
