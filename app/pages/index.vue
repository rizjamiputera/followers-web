<template>
    <div class="section-container">
        <section v-if="isEmpty && !first_event && !from_second_events.length" class="h-screen flex items-center">
            <div class="text-green-main font bold text-center text-lg">
                Website ini akan menjadi ruang dakwah, tempat para ustadz berbagi ilmu, nasihat, dan inspirasi. Konten
                akan
                segera hadir, insyaAllah.
            </div>
        </section>
        <!-- <div class="h-screen bg-green-main">
            <div class="text-6xl font-extrabold text-white text-center">TEST TEST TEST</div>
        </div> -->
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
</script>
