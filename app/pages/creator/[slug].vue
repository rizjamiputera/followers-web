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
            <!-- Profile Header -->
            <div class="bg-gradient-to-r from-green-main/10 to-green-main/20 rounded-2xl p-6 md:p-8">
                <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
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
                        <!-- Verification badge -->
                        <div v-if="false"
                            class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-main rounded-full flex items-center justify-center border-3 border-white">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>

                    <!-- Profile Info -->
                    <div class="flex-1 text-center md:text-left">
                        <div class="flex items-center gap-3">
                            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ profile.user?.name }}</h1>
                            <FollowButton v-if="profile.user" :userId="profile.user.id" @updated="getData" />
                        </div>
                        <p class="text-green-main/70 mb-4">@{{ profile.slug }}</p>

                        <!-- Stats -->
                        <div class="flex justify-center md:justify-start items-center gap-6 mb-4">
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
                            class="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
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
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Biography -->
                    <div class="lg:col-span-2">
                        <h2 class="font-cinzel tracking-wide font-bold text-green-main mb-4">Tentang Penulis</h2>
                        <div v-if="content" class="prose prose-lg max-w-none">
                            <WysiwygRenderer :content="content" />
                        </div>
                        <div v-else class="text-gray-500 italic">
                            Penulis belum menambahkan biografi.
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        <!-- Social Links -->
                        <div v-if="profile.socialLinks && profile.socialLinks.length > 0">
                            <h3 class="font-cinzel tracking-wide font-bold text-green-main mb-4">Media Sosial</h3>
                            <div class="space-y-3">
                                <a v-for="social in profile.socialLinks" :key="social.platform" :href="social.url"
                                    target="_blank"
                                    class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-main hover:bg-green-main/5 transition-colors">
                                    <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <SocialIcon :platform="social.platform" class="w-5 h-5" />
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm text-gray-600">{{ social.handle || social.url }}</div>
                                    </div>
                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14">
                                        </path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <LazyArticleLatestSm v-if="profile" :authorId="profile.userId"
                                :authorName="profile.user?.name" />
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Content } from '~/interfaces/content-interface';
import type { Profile } from '~/interfaces/user-interface';

// Get route params
const route = useRoute();
const slug = route.params.slug as string;

// State
const profile = ref<Profile | null>(null);
const isLoading = ref(true);
const isNotFound = ref(false);

const content = computed(() => {
    if (!profile.value) return null;
    if (!profile.value.biography) return null;

    return profile.value.biography.content
})

// Fetch creator profile
const { public: { apiUri, webUri } } = useRuntimeConfig();

try {
    // Server-side fetch for SEO
    const { data: profileData } = await useFetch(`${apiUri}/v1/creator/public/${slug}?includes=user`, {
        server: true,
    });

    if (profileData.value) {
        profile.value = profileData.value as Profile;
    } else {
        isNotFound.value = true;
    }
} catch (error) {
    isNotFound.value = true;
} finally {
    isLoading.value = false;
}

const getData = async () => {
    const response = await Api.get(`/v1/creator/public/${slug}?includes=user,biography,socialLinks`);

    if (response) {
        profile.value = response as Profile;
    }
}

// re-fetch to get complete relation
onMounted(() => {
    recordVisit();
    getData();
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
    ogUrl: () => `${webUri}/creator/${slug}`
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
