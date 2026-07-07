<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between gap-2 items-center">
            <div class="main-title">Manajemen Pemateri</div>
            <Button v-if="canCreate" @click="openCreate" class="btn-sm btn-green">
                <LucidePlus class="h-4 w-4" />
                Tambah Pemateri
            </Button>
        </div>

        <!-- Search -->
        <div class="relative max-w-sm">
            <input v-model="search" type="text" placeholder="Cari pemateri..."
                class="input input-bordered input-sm w-full pl-9" />
            <LucideSearch class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div class="text-sm text-gray-600">Total: {{ total }} pemateri</div>

        <div v-if="isLoading && speakers.length === 0" class="flex justify-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-2xl border border-green-main/5 bg-base-100">
            <table class="table">
                <thead>
                    <tr>
                        <th>Pemateri</th>
                        <th class="text-center">Kajian</th>
                        <th class="text-center">Terverifikasi</th>
                        <th v-if="canEdit || canDelete" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!isLoading && speakers.length === 0">
                        <td colspan="4" class="text-center text-green-main font-light">Belum ada pemateri</td>
                    </tr>
                    <tr v-for="sp in speakers" :key="sp.id">
                        <td>
                            <div class="flex items-center gap-3">
                                <div class="avatar">
                                    <div class="w-10 h-10 rounded-full">
                                        <img v-if="sp.avatar_md" :src="sp.avatar_md" :alt="sp.name" />
                                        <div v-else
                                            class="w-10 h-10 rounded-full bg-green-main/10 flex items-center justify-center text-sm font-bold text-green-main">
                                            {{ sp.name.charAt(0).toUpperCase() }}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-medium">
                                        <span v-if="sp.honorific" class="font-normal text-gray-500">{{ sp.honorific }}&nbsp;</span>{{ sp.name }}
                                    </div>
                                    <div v-if="sp.credentials" class="text-xs text-gray-400">{{ sp.credentials }}</div>
                                    <code class="text-xs text-gray-300">{{ sp.slug }}</code>
                                </div>
                            </div>
                        </td>
                        <td class="text-center">
                            <span class="badge badge-ghost">{{ sp._count?.contents ?? 0 }}</span>
                        </td>
                        <td class="text-center">
                            <button v-if="canPublish" @click="toggleVerified(sp)"
                                :class="sp.verified ? 'badge-success' : 'badge-ghost'"
                                class="badge cursor-pointer hover:opacity-80 transition-opacity">
                                {{ sp.verified ? 'Ya' : 'Tidak' }}
                            </button>
                            <span v-else :class="sp.verified ? 'badge-success' : 'badge-ghost'" class="badge">
                                {{ sp.verified ? 'Ya' : 'Tidak' }}
                            </span>
                        </td>
                        <td v-if="canEdit || canDelete" class="text-center">
                            <div class="flex gap-1 justify-center">
                                <Button v-if="canEdit" @click="openEdit(sp)" class="btn-sm btn-outline-green">
                                    <LucidePencilLine class="h-3 w-3" /> Edit
                                </Button>
                                <Button v-if="canDelete" @click="openDelete(sp)" class="btn-sm btn-outline-red">
                                    <LucideTrash2 class="h-3 w-3 stroke-error" /> Hapus
                                </Button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="speakers.length < total" class="flex justify-center">
            <Button @click="loadMore" :disabled="isLoading" class="btn-sm btn-outline-green">
                Muat lebih banyak
            </Button>
        </div>
    </div>

    <LazyCpPemateriForm v-if="showForm" :show="showForm" :data="editing" @close="showForm = false" @saved="onSaved" />

    <!-- Delete confirm -->
    <Modal :show="showDelete" @close="showDelete = false">
        <div class="p-6" v-if="toDelete">
            <h3 class="text-lg font-semibold mb-2">Hapus Pemateri</h3>
            <p class="text-sm text-gray-600 mb-4">
                Yakin ingin menghapus <b>{{ toDelete.name }}</b>? Pemateri yang masih tertaut ke kajian tidak dapat dihapus.
            </p>
            <div class="flex justify-end gap-2">
                <Button type="button" @click="showDelete = false" class="btn-ghost">Batal</Button>
                <Button type="button" @click="confirmDelete" class="btn-error" :disabled="deleting">
                    <span v-if="deleting" class="loading loading-spinner loading-xs"></span>
                    Hapus
                </Button>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { LucidePlus, LucidePencilLine, LucideTrash2, LucideSearch } from 'lucide-vue-next';
import type { Paginate } from '~/interfaces/app-interface';
import type { Speaker } from '~/interfaces/speaker-interface';
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
const canPublish = computed(() => AuthStore.can(Module.ARTICLE, Permission.PUBLISH));

const LIMIT = 20;
const speakers = ref<Speaker[]>([]);
const total = ref(0);
const page = ref(1);
const search = ref('');
const isLoading = ref(false);

const load = async (reset = true) => {
    isLoading.value = true;
    try {
        const res = await Api.get(
            `/v1/speakers?page=${page.value}&limit=${LIMIT}&search=${encodeURIComponent(search.value)}&sortBy=name&order=asc`,
        ) as Paginate<Speaker[]>;
        total.value = res.total;
        speakers.value = reset ? res.data : [...speakers.value, ...res.data];
    } catch (error) {
        toastError(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => load(true));

let searchTimeout: NodeJS.Timeout;
watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        page.value = 1;
        load(true);
    }, 400);
});

const loadMore = () => {
    page.value++;
    load(false);
};

// Modals
const showForm = ref(false);
const editing = ref<Speaker | null>(null);

const openCreate = () => {
    editing.value = null;
    showForm.value = true;
};
const openEdit = (sp: Speaker) => {
    editing.value = sp;
    showForm.value = true;
};
const onSaved = () => {
    page.value = 1;
    load(true);
};

// Verify toggle
const toggleVerified = async (sp: Speaker) => {
    try {
        await Api.patch('/v1/speakers/' + sp.id + '/verify', { verified: !sp.verified });
        sp.verified = !sp.verified;
    } catch (error) {
        toastError(error);
    }
};

// Delete
const showDelete = ref(false);
const toDelete = ref<Speaker | null>(null);
const deleting = ref(false);
const openDelete = (sp: Speaker) => {
    toDelete.value = sp;
    showDelete.value = true;
};
const confirmDelete = async () => {
    if (!toDelete.value) return;
    deleting.value = true;
    try {
        await Api.remove('/v1/speakers/' + toDelete.value.id);
        toastSuccess('Pemateri berhasil dihapus');
        showDelete.value = false;
        page.value = 1;
        await load(true);
    } catch (error) {
        toastError(error);
    } finally {
        deleting.value = false;
    }
};
</script>
