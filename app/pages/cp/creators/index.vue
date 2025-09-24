<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Manage Creators</h1>
                <p class="text-gray-600">Enable or disable creator profiles visibility</p>
            </div>
        </div>

        <div class="stats shadow w-full">
            <div class="stat">
                <div class="stat-title">Public Creators</div>
                <div class="stat-value text-primary">{{ stats.totalPublic }}</div>
                <div class="stat-desc">Currently public</div>
            </div>
            <div class="stat">
                <div class="stat-title">Total Creators</div>
                <div class="stat-value">{{ stats.total }}</div>
                <div class="stat-desc">All creator profiles</div>
            </div>
        </div>

        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="card-title">Creator Profiles</h2>
                    <div class="flex items-center gap-2">
                        <div class="form-control">
                            <input v-model="search" @input="handleSearch" type="text" placeholder="Search creators..."
                                class="input input-bordered input-sm w-64" />
                        </div>
                        <div class="form-control">
                            <select v-model="filterPublic" class="select select-bordered select-sm">
                                <option value="">All Creators</option>
                                <option value="true">Public Only</option>
                                <option value="false">Private Only</option>
                            </select>
                        </div>
                        <button @click="loadCreators" class="btn btn-sm btn-outline">
                            <LucideRefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
                        </button>
                    </div>
                </div>

                <div v-if="isLoading" class="flex justify-center py-8">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>

                <div v-else-if="isEmpty" class="text-center py-8 text-gray-500">
                    <LucideUser class="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No creators found</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead>
                            <tr>
                                <th>Creator</th>
                                <th>Specializations</th>
                                <th>Stats</th>
                                <th>Public</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="creator in creators" :key="creator.slug">
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div class="avatar">
                                            <div class="mask mask-squircle w-12 h-12">
                                                <img v-if="creator.user?.avatar" :src="creator.user.avatar"
                                                    :alt="creator.user.name" />
                                                <div v-else
                                                    class="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center">
                                                    <LucideUser class="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-semibold">{{ creator.user?.name }}</div>
                                            <div class="text-sm opacity-70">@{{ creator.slug }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <span v-for="spec in creator.specializations.slice(0, 3)" :key="spec"
                                            class="badge badge-sm badge-outline">
                                            {{ spec }}
                                        </span>
                                        <span v-if="creator.specializations.length > 3"
                                            class="badge badge-sm badge-ghost">
                                            +{{ creator.specializations.length - 3 }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-4 text-xs">
                                        <div class="flex items-center gap-1">
                                            <LucideFileText class="h-3 w-3" />
                                            <span>{{ creator.totalArticles || 0 }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <LucideUsers class="h-3 w-3" />
                                            <span>{{ creator.totalFollowers || 0 }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="form-control">
                                        <label class="label cursor-pointer">
                                            <input type="checkbox" :checked="creator.isPublic"
                                                @change="togglePublic(creator)" :disabled="updating || !canEdit"
                                                class="checkbox checkbox-primary checkbox-sm" />
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <NuxtLink :to="`/creator/${creator.slug}`" target="_blank"
                                            class="btn btn-ghost btn-xs">
                                            <LucideExternalLink class="h-4 w-4" />
                                        </NuxtLink>
                                        <NuxtLink v-if="canEdit" :to="`/cp/creators/${creator.id}`"
                                            class="btn btn-ghost btn-xs">
                                            <LucideEdit class="h-4 w-4" />
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="last_page > 1" class="flex justify-center mt-6">
                    <div class="join">
                        <button v-for="pageNum in paginationRange" :key="pageNum" @click="goToPage(pageNum)"
                            class="join-item btn btn-sm" :class="{ 'btn-active': pageNum === page }">
                            {{ pageNum }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    LucideRefreshCw,
    LucideUser,
    LucideFileText,
    LucideUsers,
    LucideExternalLink,
    LucideEdit
} from 'lucide-vue-next'
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel'
})

const AuthStore = useAuthStore()
const canEdit = computed(() => AuthStore.can(Module.USER, Permission.EDIT))

const CreatorStores = useCreatorStore();

const { creators, isEmpty, isLoading, total, parameters, search: storeSearch, page, last_page } = storeToRefs(CreatorStores);
const { get, reset } = CreatorStores;

const search = ref('');
const updating = ref(false);
const stats = ref({ totalPublic: 0, total: 0 });
let searchTimeout: NodeJS.Timeout;

const filterPublic = computed({
    get: () => CreatorStores.isPublic === undefined ? '' : String(CreatorStores.isPublic),
    set: (value: string) => {
        CreatorStores.isPublic = value === '' ? undefined : value;
        parameters.value.page = 1;
        get();
    }
});

const paginationRange = computed(() => {
    const range = [];
    const total = last_page.value;
    const current = page.value as number;

    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        range.push(i);
    }

    return range;
});

const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        storeSearch.value = search.value;
        parameters.value.page = 1;
        get();
    }, 500);
};

const loadCreators = () => {
    reset();
    search.value = '';
    get();
};

const goToPage = (pageNum: number) => {
    parameters.value.page = pageNum;
    get();
};

const loadStats = async () => {
    try {
        const response = await Api.get('/v1/creator/stats') as any;
        stats.value = response;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
};

const togglePublic = async (creator: any) => {
    updating.value = true;
    try {
        await Api.patch(`/v1/creator/${creator.id}/toggle-public`);

        creator.isPublic = !creator.isPublic;
        await loadStats();

    } catch (error) {
        console.error('Failed to update public status:', error);
    } finally {
        updating.value = false;
    }
};

onMounted(() => {
    reset();
    get();
    loadStats();
});
</script>

<style scoped></style>
