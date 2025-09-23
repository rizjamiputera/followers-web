<template>
    <section>
        <div class="flex flex-col gap-4">
            <div>
                <DefaultTitle>Penulis</DefaultTitle>
                <DefaultSubtitle>العلماء ورثة الانبياء</DefaultSubtitle>
            </div>
            <!-- Search Bar -->
            <div class="mb-6">
                <div class="relative max-w-md">
                    <input v-model="search" type="text" placeholder="Cari penulis atau bidang keahlian..."
                        class="w-full px-4 py-3 pl-10 pr-4 border border-green-main/30 rounded-xl focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main"
                        @input="onSearchInput" />
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                <template v-if="isEmpty && !isLoading">
                    <div class="col-span-full text-center py-12">
                        <div class="text-6xl mb-4">📚</div>
                        <div class="text-xl text-green-main/70 mb-2">Belum ada penulis</div>
                        <div class="text-gray-500">Penulis akan muncul di sini setelah mereka membuat profil publik
                        </div>
                    </div>
                </template>
                <template v-for="(creator, n) in creators" :key="creator.slug || n">
                    <NuxtLink :to="'/@' + creator.slug" prefetch-on="interaction"
                        class="group bg-white border border-green-main/20 rounded-xl p-4 hover:shadow-lg hover:border-green-main/40 transition-all duration-300 hover:-translate-y-1">

                        <!-- Avatar -->
                        <div class="flex justify-center mb-4">
                            <div class="relative">
                                <Image v-if="creator.user?.avatar_md" :src="creator.user.avatar_md"
                                    class="w-20 h-20 rounded-full bg-cover bg-center border-3 border-green-main/20 group-hover:border-green-main/40 transition-colors" />
                                <div v-else
                                    class="w-20 h-20 rounded-full bg-gradient-to-br from-green-main/20 to-green-main/40 flex items-center justify-center border-3 border-green-main/20">
                                    <span class="text-2xl font-bold text-green-main">{{
                                        creator.user?.name?.charAt(0)?.toUpperCase() }}</span>
                                </div>
                                <!-- Verification badge -->
                                <div v-if="false"
                                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-main rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Name and Stats -->
                        <div class="text-center mb-3">
                            <h3
                                class="font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-green-main transition-colors">
                                {{ creator.user?.name }}
                            </h3>
                            <div class="flex justify-center items-center gap-4 text-sm text-gray-600">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                        </path>
                                    </svg>
                                    {{ creator.totalArticles || 0 }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                        </path>
                                    </svg>
                                    {{ creator.totalFollowers || 0 }}
                                </span>
                            </div>
                        </div>

                        <!-- Specializations -->
                        <div v-if="creator.specializations && creator.specializations.length > 0" class="mb-3">
                            <div class="flex flex-wrap gap-1 justify-center">
                                <span v-for="spec in creator.specializations.slice(0, 3)" :key="spec"
                                    class="px-2 py-1 bg-green-main/10 text-green-main text-xs rounded-full font-medium">
                                    {{ spec }}
                                </span>
                                <span v-if="creator.specializations.length > 3"
                                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                    +{{ creator.specializations.length - 3 }}
                                </span>
                            </div>
                        </div>

                    </NuxtLink>
                </template>
                <template v-if="isLoading" v-for="m in 12" :key="m">
                    <div class="bg-white border border-green-main/20 rounded-xl p-4 animate-pulse">
                        <!-- Avatar Skeleton -->
                        <div class="flex justify-center mb-4">
                            <div class="w-20 h-20 rounded-full bg-green-main/20"></div>
                        </div>

                        <!-- Name Skeleton -->
                        <div class="text-center mb-3">
                            <div class="h-5 bg-green-main/20 rounded w-3/4 mx-auto mb-2"></div>
                            <div class="flex justify-center gap-4">
                                <div class="h-4 bg-green-main/20 rounded w-12"></div>
                                <div class="h-4 bg-green-main/20 rounded w-12"></div>
                            </div>
                        </div>

                        <!-- Specializations Skeleton -->
                        <div class="mb-3">
                            <div class="flex justify-center gap-1">
                                <div class="h-6 bg-green-main/20 rounded-full w-16"></div>
                                <div class="h-6 bg-green-main/20 rounded-full w-12"></div>
                                <div class="h-6 bg-green-main/20 rounded-full w-14"></div>
                            </div>
                        </div>

                        <!-- Social Links Skeleton -->
                        <div class="flex justify-center gap-2">
                            <div class="w-6 h-6 rounded bg-green-main/20"></div>
                            <div class="w-6 h-6 rounded bg-green-main/20"></div>
                            <div class="w-6 h-6 rounded bg-green-main/20"></div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="flex justify-center mt-8">
                <Button v-if="creators.length < total && !isLoading"
                    class="btn btn-green font-cinzel tracking-wide px-8 py-3 text-lg" @click="loadMore"
                    :disabled="isLoading">
                    Lihat lebih banyak
                </Button>
                <div v-else-if="creators.length >= total && creators.length > 0" class="text-center text-gray-500">
                    <div class="text-2xl mb-2">✨</div>
                    <p>Semua penulis telah ditampilkan</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>

// SEO and META
const { public: { webUri } } = useRuntimeConfig();
const title = 'Creator - Followers Bicara';
const description = "Ruang dakwah, tempat para ustadz berbagi ilmu, nasihat, dan inspirasi.";

useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => webUri + '/logo-hitam.jpg',
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: webUri + '/creator'
});

const CreatorStores = useCreatorStore();

const { creators, isEmpty, isLoading, total, parameters, search: storeSearch } = storeToRefs(CreatorStores);
const { get, reset } = CreatorStores;

// Local search ref
const search = ref('');
let searchTimeout: NodeJS.Timeout;

onMounted(() => {
    reset();
    get();
});

// Watch for search changes
const onSearchInput = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        storeSearch.value = search.value;
        parameters.value.page = 1;
        get(true);
    }, 500);
};

// Load more functionality
const loadMore = () => {
    parameters.value.page++;
    get(false);
};

</script>

<style></style>
