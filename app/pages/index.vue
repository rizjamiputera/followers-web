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
        <section v-if="!isEmpty || first_event || from_second_events.length" class="py-8">
            <!-- Featured Content -->
            <div v-if="combinedFeaturedContent && combinedFeaturedContent.length > 0" class="mb-12">
                <FeaturedCarousel :items="combinedFeaturedContent" title="Featured Content" :items-per-view="3" />
            </div>
        </section>

        <PagesIndexEvents />
        <PagesIndexLatest />
    </div>
</template>

<script lang="ts" setup>
import { PagesIndexLatest } from '#components';

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

// Fetch on mount
onMounted(() => {
    fetchFeaturedContent()
})
</script>
