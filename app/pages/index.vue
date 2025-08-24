<template>
    <div class="section-container">
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

const route = useRoute();
onMounted(() => {
    recordVisit(route.path);
})

</script>
