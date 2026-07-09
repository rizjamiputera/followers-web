<template>
    <div class="section-container">
        <section v-if="isEmpty && !first_event && !from_second_events.length && !combinedFeaturedContent.length"
            class="h-screen flex items-center">
            <div class="text-green-main font bold text-center text-lg">
                Website ini akan menjadi ruang dakwah, tempat para ustadz berbagi ilmu, nasihat, dan inspirasi. Konten
                akan
                segera hadir, insyaAllah.
            </div>
        </section>

        <!-- Featured Content Section -->
        <section v-if="combinedFeaturedContent && combinedFeaturedContent.length > 0"
            class="py-8 flex max-md:flex-col items-stretch gap-5 w-full">
            <!-- CAROUSEL: Featured Content -->
            <div class="md:flex-1 w-full md:w-7/10">
                <FeaturedCarousel :items="combinedFeaturedContent" title="Featured Content" :items-per-view="3" />
            </div>

            <!-- First Highlight Article -->
            <div class="w-full md:w-3/10 h-full max-md:hidden">
                <template v-if="firstFeaturedArticle">
                    <NuxtLink :to="'/read/' + firstFeaturedArticle.slug" prefetch-on="interaction"
                        class=" w-full h-full flex flex-col gap-2 border border-border-main rounded-3xl p-6 bg-white/50">
                        <Image :src="firstFeaturedArticle.image_md"
                            class="flex-1 aspect-square w-full h-full rounded-2xl bg-cover bg-no-repeat" />
                        <div class="w-full">
                            <AvatarPublishedAt :data="firstFeaturedArticle" class="text-xs" avatar_width="w-5 h-5" />
                            <div class="flex flex-col gap-2 text-xs">
                                <div class="line-clamp-1 font-bold">{{ firstFeaturedArticle.title }}</div>
                                <div class="line-clamp-2">{{ firstFeaturedArticle.excerpt }}</div>
                            </div>
                        </div>
                    </NuxtLink>
                </template>
            </div>
        </section>
        <section v-if="loadingFeatured" class="py-8 flex max-md:flex-col gap-5 w-full md:aspect-21/9">
            <div class="md:flex-1 max-md:aspect-3/4 w-full border-border-main rounded-3xl bg-green-main/20 skeleton">
            </div>
            <div class="w-full md:w-3/10 h-full max-md:hidden rounded-3xl bg-green-main/20 skeleton"></div>
        </section>

        <!-- <PagesIndexEvents /> -->
        <PagesIndexLatest />

        <!-- One section per category admin has enabled for the home page.
             Server-rendered so each section ships in the initial HTML. -->
        <PagesIndexCategorySection v-for="cat in homeCategories" :key="cat.id" :category="cat" />
    </div>
</template>

<script lang="ts" setup>
import { PagesIndexLatest } from '#components';
import type { Article } from '~/interfaces/article-interface';

// SEO and META
const { public: { webUri } } = useRuntimeConfig();
const siteName = 'FollowersBicara.com';
const title = 'Followers Bicara — Ruang Dakwah, Ilmu, dan Inspirasi Islami';
const description = "Ruang dakwah tempat para ustadz berbagi ilmu, nasihat, dan inspirasi. Baca artikel Islami terbaru dan ikuti kajian serta kegiatan dakwah.";
const ogImage = webUri + '/logo-hitam.jpg';

useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    twitterTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    twitterDescription: () => description,
    ogImage: () => ogImage,
    twitterImage: () => ogImage,
    twitterCard: 'summary_large_image',
    ogType: 'website',
    ogLocale: 'id_ID',
    ogSiteName: siteName,
    ogUrl: webUri,
});

// Canonical + structured data (Organization + WebSite) so search engines can
// build the knowledge panel and a sitelinks search box for the homepage.
useHead({
    link: [{ rel: 'canonical', href: webUri }],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'Organization',
                        '@id': `${webUri}/#organization`,
                        name: siteName,
                        url: webUri,
                        logo: ogImage,
                        description,
                    },
                    {
                        '@type': 'WebSite',
                        '@id': `${webUri}/#website`,
                        name: siteName,
                        url: webUri,
                        inLanguage: 'id-ID',
                        publisher: { '@id': `${webUri}/#organization` },
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: {
                                '@type': 'EntryPoint',
                                urlTemplate: `${webUri}/search?q={search_term_string}`,
                            },
                            'query-input': 'required name=search_term_string',
                        },
                    },
                ],
            }),
        },
    ],
});

const { isEmpty } = storeToRefs(useLatestArticleStore());
const { from_second_events, first_event } = storeToRefs(useUpcomingEventStore());

const CategoriesStore = useCategoriesStore();
if (!CategoriesStore.loaded) await CategoriesStore.fetch();
const { homeCategories } = storeToRefs(CategoriesStore);

// Featured content data
const featuredArticles = ref<any[]>([])
const featuredEvents = ref<any[]>([])

// Combined featured content
const combinedFeaturedContent = computed(() => {
    const combined = [...featuredArticles.value, ...featuredEvents.value]
    // Sort by publishedAt for articles and start_at for events
    return combined.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.start_at)
        const dateB = new Date(b.publishedAt || b.start_at)
        return dateB.getTime() - dateA.getTime() // Latest first
    })
})

// SSR + hydration fetch so crawlers see the homepage shell with data.
const { data: homepageData, pending: loadingFeatured } = await useAsyncData(
    'homepage-data',
    async () => {
        try {
            return await Api.get('/v1/home-page/data') as any;
        } catch (e) {
            console.error('Error fetching featured content:', e);
            return null;
        }
    }
);

watchEffect(() => {
    featuredArticles.value = Array.isArray(homepageData.value?.featuredArticles) ? homepageData.value.featuredArticles : [];
    featuredEvents.value = Array.isArray(homepageData.value?.featuredEvents) ? homepageData.value.featuredEvents : [];
});

const firstFeaturedArticle = computed<Article>(() => {
    return featuredArticles.value[0];
})

onMounted(() => {
    recordVisit();
})
</script>
