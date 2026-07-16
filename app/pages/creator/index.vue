<template>
    <section class="creator-lab">
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
                    <NuxtLink :to="'/creator/' + creator.user?.username" prefetch-on="interaction"
                        class="c-card group">

                        <!-- Avatar -->
                        <div class="cc-avatar-row flex justify-center mb-4">
                            <div class="relative">
                                <Image v-if="creator.user?.avatar_md" :src="creator.user.avatar_md"
                                    class="cc-avatar rounded-full bg-cover bg-center border-3 border-green-main/20 group-hover:border-green-main/40 transition-colors" />
                                <div v-else
                                    class="cc-avatar rounded-full bg-gradient-to-br from-green-main/20 to-green-main/40 flex items-center justify-center border-3 border-green-main/20">
                                    <span class="cc-avatar-initial text-2xl font-bold text-green-main">{{
                                        creator.user?.name?.charAt(0)?.toUpperCase() }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="cc-body">
                            <!-- Name and Stats -->
                            <div class="cc-head text-center mb-3">
                                <h3
                                    class="cc-name font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-green-main transition-colors">
                                    {{ creator.user?.name }}
                                </h3>
                                <div class="cc-stats flex justify-center items-center gap-3 text-sm">
                                    <span class="flex items-center gap-1.5 text-gray-600" title="Artikel">
                                        <LucideFileText :size="15" class="text-green-main/80 shrink-0" />
                                        <b class="font-semibold text-gray-800 tabular-nums">{{ creator.totalArticles || 0 }}</b>
                                    </span>
                                    <span class="w-px h-3.5 bg-green-main/15"></span>
                                    <span class="flex items-center gap-1.5 text-gray-600" title="Pengikut">
                                        <LucideUsers :size="15" class="text-green-main/80 shrink-0" />
                                        <b class="font-semibold text-gray-800 tabular-nums">{{ creator.totalFollowers || 0 }}</b>
                                    </span>
                                </div>
                            </div>

                            <!-- Specializations -->
                            <div v-if="creator.specializations && creator.specializations.length > 0" class="cc-meta mb-3">
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
            </div>

            <!-- ===== PEMATERI ===== -->
            <div class="mt-12 pt-8 border-t border-green-main/15">
                <div class="mb-6">
                    <DefaultTitle>Pemateri</DefaultTitle>
                    <DefaultSubtitle>Para pemateri yang ilmunya menjadi bacaan</DefaultSubtitle>
                </div>

                <!-- Search Bar (Pemateri) -->
                <div class="mb-6">
                    <div class="relative max-w-md">
                        <input v-model="speakerSearch" type="text" placeholder="Cari pemateri berdasarkan nama atau gelar..."
                            class="w-full px-4 py-3 pl-10 pr-4 border border-green-main/30 rounded-xl focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main"
                            @input="onSpeakerSearchInput" />
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    <template v-if="speakers.length === 0 && !speakersLoading">
                        <div class="col-span-full text-center py-10">
                            <template v-if="speakerSearch">
                                <div class="text-5xl mb-3">🔍</div>
                                <div class="text-lg text-green-main/70 mb-1">Pemateri tidak ditemukan</div>
                                <div class="text-gray-500 text-sm">Tidak ada hasil untuk “{{ speakerSearch }}” — coba kata kunci lain</div>
                            </template>
                            <template v-else>
                                <div class="text-5xl mb-3">🎙️</div>
                                <div class="text-lg text-green-main/70 mb-1">Belum ada pemateri</div>
                                <div class="text-gray-500 text-sm">Pemateri akan muncul setelah ditautkan ke kajian</div>
                            </template>
                        </div>
                    </template>

                    <template v-for="(speaker, n) in speakers" :key="speaker.slug || n">
                        <NuxtLink :to="`/pemateri/${speaker.slug}`" prefetch-on="interaction"
                            class="c-card group">
                            <div class="cc-avatar-row flex justify-center mb-4">
                                <div class="relative">
                                    <Image v-if="speaker.avatar_md" :src="speaker.avatar_md"
                                        class="cc-avatar rounded-full bg-cover bg-center border-3 border-green-main/20 group-hover:border-green-main/40 transition-colors" />
                                    <div v-else
                                        class="cc-avatar rounded-full bg-gradient-to-br from-green-main/20 to-green-main/40 flex items-center justify-center border-3 border-green-main/20">
                                        <span class="cc-avatar-initial text-2xl font-bold text-green-main">{{
                                            speaker.name?.charAt(0)?.toUpperCase() }}</span>
                                    </div>
                                    <div v-if="speaker.verified"
                                        class="cc-badge absolute -bottom-1 -right-1 w-6 h-6 bg-green-main rounded-full flex items-center justify-center"
                                        title="Terverifikasi">
                                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="cc-body">
                                <div class="cc-head text-center mb-3">
                                    <h3 class="cc-name font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-green-main transition-colors">
                                        <span v-if="speaker.honorific" class="font-medium">{{ speaker.honorific }}&nbsp;</span>{{ speaker.name }}
                                    </h3>
                                    <p v-if="speaker.credentials" class="cc-meta text-sm text-gray-500 line-clamp-1">{{ speaker.credentials }}</p>
                                </div>
                                <div class="cc-stats flex justify-center items-center gap-1.5 text-sm text-gray-600" title="Jumlah kajian">
                                    <LucideBookOpen :size="15" class="text-green-main/80 shrink-0" />
                                    <b class="font-semibold text-gray-800 tabular-nums">{{ speaker._count?.contents || 0 }}</b> kajian
                                </div>
                            </div>
                        </NuxtLink>
                    </template>

                    <template v-if="speakersLoading">
                        <div v-for="m in 4" :key="`sk-${m}`" class="bg-white border border-green-main/20 rounded-xl p-4 animate-pulse">
                            <div class="flex justify-center mb-4">
                                <div class="w-20 h-20 rounded-full bg-green-main/20"></div>
                            </div>
                            <div class="text-center mb-3">
                                <div class="h-5 bg-green-main/20 rounded w-3/4 mx-auto mb-2"></div>
                                <div class="h-4 bg-green-main/20 rounded w-1/2 mx-auto"></div>
                            </div>
                            <div class="flex justify-center">
                                <div class="h-4 bg-green-main/20 rounded w-20"></div>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="flex justify-center mt-8">
                    <Button v-if="speakers.length < speakersTotal && !speakersLoading"
                        class="btn btn-green font-cinzel tracking-wide px-8 py-3 text-lg" @click="loadMoreSpeakers">
                        Lihat lebih banyak pemateri
                    </Button>
                </div>
            </div>
        </div>

    </section>
</template>

<script lang="ts" setup>
import { LucideFileText, LucideUsers, LucideBookOpen } from 'lucide-vue-next'
import type { Paginate } from '~/interfaces/app-interface'
import type { Speaker } from '~/interfaces/speaker-interface'

// SEO and META
const { public: { webUri, apiUri } } = useRuntimeConfig();
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
    recordVisit();
    reset();
    CreatorStores.isPublicApi = true;
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


onUnmounted(reset);

// ===== PEMATERI (speakers) — direct fetch, no Pinia =====
const SPEAKER_LIMIT = 12;
const speakers = useState<Speaker[]>('creator-speakers', () => []);
const speakersTotal = useState<number>('creator-speakers-total', () => 0);
const speakersPage = ref(1);
const speakersLoading = ref(false);
const speakerSearch = ref('');
let speakerSearchTimeout: NodeJS.Timeout;

async function loadSpeakers(reset = false) {
    speakersLoading.value = true;
    try {
        const res = await $fetch<Paginate<Speaker[]>>(`${apiUri}/v1/speakers`, {
            query: {
                page: speakersPage.value,
                limit: SPEAKER_LIMIT,
                sortBy: 'name',
                order: 'asc',
                // Public page: only pemateri with published kajian.
                hasPublished: true,
                ...(speakerSearch.value.trim() ? { search: speakerSearch.value.trim() } : {}),
            },
        });
        speakersTotal.value = res.total;
        speakers.value = reset ? res.data : [...speakers.value, ...res.data];
    } finally {
        speakersLoading.value = false;
    }
}

// SSR-fetch the first page so the section is crawlable and hydrates cleanly
await useAsyncData('creator-speakers-initial', async () => {
    speakersPage.value = 1;
    await loadSpeakers(true);
    return true;
});

// Debounced search — reset to page 1 and refetch from the top
const onSpeakerSearchInput = () => {
    clearTimeout(speakerSearchTimeout);
    speakerSearchTimeout = setTimeout(() => {
        speakersPage.value = 1;
        loadSpeakers(true);
    }, 500);
};

function loadMoreSpeakers() {
    speakersPage.value++;
    loadSpeakers(false);
}
</script>

<style>
/* ===== Creator/Speaker card — soft green glow dissolving into white ===== */
.creator-lab .c-card {
    display: block;
    position: relative;
    overflow: hidden;
    padding: 1.15rem 1rem 0.95rem;
    border-radius: 1rem;
    border: 1px solid rgba(0, 116, 38, .12);
    background-color: #fff;
    background-image: linear-gradient(180deg,
        rgba(0, 116, 38, .15) 0,
        rgba(66, 230, 134, .07) 84px,
        rgba(255, 255, 255, 0) 210px);
    background-repeat: no-repeat;
    transition: transform .28s cubic-bezier(.2, .7, .3, 1), box-shadow .28s, border-color .28s, background-image .28s;
}
.creator-lab .c-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 38px -18px rgba(10, 60, 25, .3);
    background-image: linear-gradient(180deg,
        rgba(0, 116, 38, .2) 0,
        rgba(66, 230, 134, .09) 84px,
        rgba(255, 255, 255, 0) 210px);
}
@media (prefers-reduced-motion: reduce) {
    .creator-lab .c-card { transition: none; }
}

/* ===== In-card content ===== */
.creator-lab .cc-avatar { width: 80px; height: 80px; }

/* Stat pill — compact, hugs its content, centered */
.creator-lab .cc-stats {
    width: fit-content;
    margin: 0 auto;
    padding: 4px 11px;
    background: rgba(0, 116, 38, .07);
    border-radius: 999px;
}
</style>
