<template>
    <section>
        <div v-if="isNotFound" class="text-center py-16">
            <div class="text-6xl mb-4">🔍</div>
            <div class="text-xl text-green-main/70 mb-2">Penulis tidak ditemukan</div>
            <div class="text-gray-500">Penulis yang Anda cari mungkin sudah tidak aktif atau URL salah</div>
            <NuxtLink to="/creator" class="btn btn-green mt-4">
                Lihat Semua Penulis
            </NuxtLink>
        </div>

        <div v-else-if="isLoading" class="animate-pulse space-y-6">
            <!-- Header Skeleton -->
            <div class="bg-gradient-to-r from-green-main/10 to-green-main/20 rounded-2xl p-8">
                <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div class="w-32 h-32 rounded-full bg-green-main/20"></div>
                    <div class="flex-1 space-y-4 text-center md:text-left">
                        <div class="h-8 bg-green-main/20 rounded w-64 mx-auto md:mx-0"></div>
                        <div class="h-4 bg-green-main/20 rounded w-48 mx-auto md:mx-0"></div>
                        <div class="flex justify-center md:justify-start gap-2">
                            <div class="h-6 bg-green-main/20 rounded w-16"></div>
                            <div class="h-6 bg-green-main/20 rounded w-16"></div>
                            <div class="h-6 bg-green-main/20 rounded w-16"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Skeleton -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-4">
                    <div class="h-6 bg-green-main/20 rounded w-32"></div>
                    <div class="space-y-2">
                        <div class="h-4 bg-green-main/20 rounded"></div>
                        <div class="h-4 bg-green-main/20 rounded w-5/6"></div>
                        <div class="h-4 bg-green-main/20 rounded w-4/6"></div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="h-6 bg-green-main/20 rounded w-24"></div>
                    <div class="space-y-2">
                        <div class="h-10 bg-green-main/20 rounded"></div>
                        <div class="h-10 bg-green-main/20 rounded"></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="profile" class="space-y-8">
            <!-- Profile Header (centered) -->
            <div class="bg-gradient-to-r from-green-main/10 to-green-main/20 rounded-2xl p-6 md:p-8">
                <div class="flex flex-col gap-6 items-center">
                    <!-- Avatar -->
                    <div class="relative">
                        <Image v-if="profile.user?.avatar_md" :src="profile.user.avatar_md"
                            class="w-32 h-32 rounded-full bg-cover bg-center bg-no-repeat border-4 border-green-main/40 shadow-lg" />
                        <div v-else
                            class="w-32 h-32 rounded-full bg-gradient-to-br from-green-main/30 to-green-main/50 flex items-center justify-center border-4 border-white shadow-lg">
                            <span class="text-4xl font-bold text-white">
                                {{ profile.user?.name?.charAt(0)?.toUpperCase() }}
                            </span>
                        </div>
                    </div>

                    <!-- Profile Info -->
                    <div class="flex-1 text-center">
                        <div class="flex items-center justify-center gap-3">
                            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ profile.user?.name }}</h1>
                            <FollowButton v-if="profile.user" :userId="profile.user.id" @updated="getData" />
                        </div>
                        <p class="text-green-main/70 mb-4">@{{ profile.user?.username }}</p>

                        <!-- Stats -->
                        <div class="flex justify-center items-center gap-6 mb-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-main">{{ profile.totalArticles || 0 }}</div>
                                <div class="text-sm text-gray-600">Artikel</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-main">{{ profile.totalFollowers || 0 }}</div>
                                <div class="text-sm text-gray-600">Followers</div>
                            </div>
                        </div>

                        <!-- Specializations -->
                        <div v-if="profile.specializations && profile.specializations.length > 0"
                            class="flex flex-wrap justify-center gap-2 mb-4">
                            <div v-for="spec in profile.specializations" :key="spec"
                                class="badge badge-success badge-outline">
                                {{ spec }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <ClientOnly>
                <div>
                    <!-- Biography -->
                    <h2 class="font-cinzel tracking-wide font-bold text-green-main mb-4">Tentang Penulis</h2>
                    <div v-if="content" class="prose prose-lg max-w-none">
                        <WysiwygRenderer :content="content" />
                    </div>
                    <div v-else class="text-gray-500 italic">
                        Penulis belum menambahkan biografi.
                    </div>

                    <!-- Social Links (compact row) -->
                    <div v-if="profile.socialLinks && profile.socialLinks.length > 0" class="mt-8">
                        <h3 class="font-cinzel tracking-wide font-bold text-green-main mb-3">Media Sosial</h3>
                        <div class="flex flex-wrap gap-2.5">
                            <a v-for="social in profile.socialLinks" :key="social.platform" :href="social.url"
                                target="_blank" rel="noopener"
                                class="inline-flex items-center gap-2 py-2 px-3.5 border border-gray-200 rounded-full hover:border-green-main hover:bg-green-main/5 transition-colors">
                                <SocialIcon :platform="social.platform" class="w-4 h-4" />
                                <span class="text-sm text-gray-600">{{ social.handle || social.platform }}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </ClientOnly>

            <!-- Latest articles by this author -->
            <div v-if="profile" class="mt-12 pt-8 border-t border-green-main/15">
                <h2 class="font-cinzel tracking-wide font-bold text-green-main text-xl mb-5">Artikel Terbaru</h2>

                <!-- Search -->
                <div class="mb-6">
                    <div class="relative max-w-md">
                        <input v-model="articleSearch" type="text" placeholder="Cari artikel penulis ini..."
                            class="w-full px-4 py-3 pl-10 pr-4 border border-green-main/30 rounded-xl focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main"
                            @input="onArticleSearchInput" />
                        <div class="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                    <ArticleCard v-for="(a, n) in articles" :key="a.id || n" :data="a" />

                    <template v-if="articlesLoading">
                        <div v-for="m in 3" :key="`ask-${m}`"
                            class="border border-green-main/20 rounded-xl p-3 animate-pulse">
                            <div class="aspect-video rounded-lg bg-green-main/20 mb-3"></div>
                            <div class="h-4 bg-green-main/20 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-green-main/20 rounded w-full mb-1"></div>
                            <div class="h-3 bg-green-main/20 rounded w-2/3"></div>
                        </div>
                    </template>
                </div>

                <!-- Empty / no results -->
                <div v-if="articles.length === 0 && !articlesLoading" class="text-center py-12">
                    <template v-if="articleSearch">
                        <div class="text-4xl mb-2">🔍</div>
                        <div class="text-green-main/70">Artikel tidak ditemukan</div>
                        <div class="text-gray-500 text-sm">Tidak ada hasil untuk “{{ articleSearch }}”</div>
                    </template>
                    <template v-else>
                        <div class="text-4xl mb-2">📝</div>
                        <div class="text-green-main/70">Belum ada artikel</div>
                    </template>
                </div>

                <!-- Load more -->
                <div class="flex justify-center mt-8">
                    <Button v-if="articles.length < articlesTotal && !articlesLoading"
                        class="btn btn-green font-cinzel tracking-wide px-8 py-3 text-lg" @click="loadMoreArticles">
                        Lihat lebih banyak
                    </Button>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Profile } from '~/interfaces/user-interface';
import type { Article } from '~/interfaces/article-interface';
import type { Paginate } from '~/interfaces/app-interface';

// Get route params
const route = useRoute();
const username = route.params.username as string;

// State
const profile = ref<Profile | null>(null);
const isLoading = ref(true);
const isNotFound = ref(false);

const content = computed(() => {
    if (!profile.value) return null;
    if (!profile.value.biography) return null;

    return profile.value.biography.content
})

const { public: { apiUri, webUri } } = useRuntimeConfig();

// Single SSR + hydration fetch with all relations. Crawler and reader
// see the same data; no client re-fetch required.
const { data: profileData } = await useAsyncData(
    `creator-${username}`,
    async () => {
        try {
            return await $fetch<Profile>(`${apiUri}/v1/creator/public/${username}`, {
                query: { includes: 'user,biography,socialLinks' },
                headers: Api.headers(),
            });
        } catch (e: any) {
            if (e?.response?.status === 404 || e?.statusCode === 404) return null;
            throw e;
        }
    }
);

if (!profileData.value) {
    isNotFound.value = true;
} else {
    profile.value = profileData.value;
}
isLoading.value = false;

// ===== Latest articles by this author — search + load more =====
const ARTICLE_LIMIT = 9;
const articles = useState<Article[]>(`creator-articles-${username}`, () => []);
const articlesTotal = useState<number>(`creator-articles-total-${username}`, () => 0);
const articlesPage = ref(1);
const articlesLoading = ref(false);
const articleSearch = ref('');
let articleSearchTimeout: NodeJS.Timeout;

async function loadArticles(reset = false) {
    if (!profile.value?.userId) return;
    articlesLoading.value = true;
    try {
        const res = await $fetch<Paginate<Article[]>>(`${apiUri}/v1/article/published`, {
            query: {
                authorId: profile.value.userId,
                page: articlesPage.value,
                limit: ARTICLE_LIMIT,
                sortBy: 'publishedAt',
                order: 'desc',
                includes: 'author,tags.tag',
                ...(articleSearch.value.trim() ? { search: articleSearch.value.trim() } : {}),
            },
        });
        articlesTotal.value = res.total;
        articles.value = reset ? res.data : [...articles.value, ...res.data];
    } finally {
        articlesLoading.value = false;
    }
}

// SSR-fetch the first page so the section is crawlable and hydrates cleanly
await useAsyncData(`creator-articles-initial-${username}`, async () => {
    articlesPage.value = 1;
    await loadArticles(true);
    return true;
});

const onArticleSearchInput = () => {
    clearTimeout(articleSearchTimeout);
    articleSearchTimeout = setTimeout(() => {
        articlesPage.value = 1;
        loadArticles(true);
    }, 500);
};

function loadMoreArticles() {
    articlesPage.value++;
    loadArticles(false);
}

onMounted(() => {
    recordVisit();
});

// SEO Meta
useSeoMeta({
    title: () => profile.value ? `${profile.value.user?.name} - Penulis` : 'Penulis tidak ditemukan',
    ogTitle: () => profile.value ? `${profile.value.user?.name} - Penulis` : 'Penulis tidak ditemukan',
    description: () => profile.value ?
        `Profil ${profile.value.user?.name}, spesialisasi: ${profile.value.specializations?.join(', ')}` :
        'Penulis tidak ditemukan',
    ogDescription: () => profile.value ?
        `Profil ${profile.value.user?.name}, spesialisasi: ${profile.value.specializations?.join(', ')}` :
        'Penulis tidak ditemukan',
    ogImage: () => profile.value?.user?.avatar_md ?? (webUri + '/logo-hitam.jpg'),
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: () => `${webUri}/creator/${username}`
});
</script>

<style scoped>
.prose {
    color: inherit;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
    color: rgb(34 197 94);
}

.prose a {
    color: rgb(34 197 94);
}

.prose a:hover {
    color: rgb(21 128 61);
}
</style>
