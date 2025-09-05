<template>
    <div class="section-container">
        <section v-if="isEmpty && !first_event && !from_second_events.length" class="h-screen flex items-center">
            <div class="text-green-main font bold text-center text-lg">
                Website ini akan menjadi ruang dakwah, tempat para ustadz berbagi ilmu, nasihat, dan inspirasi. Konten
                akan
                segera hadir, insyaAllah.
            </div>
        </section>

        <!-- Featured Content Section -->
        <section v-if="!isEmpty || first_event || from_second_events.length" class="py-8 flex gap-5 w-full aspect-21/9">
            <!-- Featured Content -->
            <div v-if="combinedFeaturedContent && combinedFeaturedContent.length > 0"
                class="flex-1 border-bordder-main rounded-xl overflow-hidden">
                <FeaturedCarousel :items="combinedFeaturedContent" title="Featured Content" :items-per-view="3" />
            </div>

            <div class="w-3/10 max-md:hidden h-full">
                <template v-if="firstFeaturedArticle">
                    <NuxtLink :to="'/read/' + firstFeaturedArticle.slug" prefetch-on="interaction"
                        class="w-full h-full flex sm:flex-col gap-2 border border-border-main rounded-xl p-3 bg-white/50">
                        <Image :src="firstFeaturedArticle.image_md"
                            class="flex-1 w-full rounded-lg bg-cover bg-no-repeat" />
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

        <PagesIndexEvents />
        <PagesIndexLatest />
    </div>
</template>

<script lang="ts" setup>
import { PagesIndexLatest } from '#components';
import type { Article } from '~/interfaces/article-interface';

// SEO and META
const { public: { webUri } } = useRuntimeConfig();
const title = 'Followers Bicara';
const description = "Ruang dakwah, tempat para ustadz berbagi ilmu, nasihat, dan inspirasi.";

onMounted(recordVisit);

useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => webUri + '/logo-hitam.jpg',
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: webUri
});

const { isEmpty } = storeToRefs(useLatestArticleStore());
const { from_second_events, first_event } = storeToRefs(useUpcomingEventStore());

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

// Fetch featured content
const fetchFeaturedContent = async () => {
    try {
        // Use single endpoint for all homepage data
        const homepageData = await Api.get('/v1/home-page/data')

        featuredArticles.value = Array.isArray(homepageData?.featuredArticles) ? homepageData.featuredArticles : []
        featuredEvents.value = Array.isArray(homepageData?.featuredEvents) ? homepageData.featuredEvents : []
    } catch (error) {
        console.error('Error fetching featured content:', error)
    }
}

const firstFeaturedArticle = computed<Article>(() => {
    return featuredArticles.value[0];
})

// Fetch on mount
onMounted(() => {
    fetchFeaturedContent()
})
</script>
