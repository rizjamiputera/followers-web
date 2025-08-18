<template>
    <section ref="sectionRef">
        <div class="flex flex-col gap-4">
            <div class="flex justify-between items-end">
                <DefaultTitle class="text-green-main">Artikel Terbaru</DefaultTitle>
                <Pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                <template v-if="!isLoading" v-for="(data, n) in latest_articles" :key="n">
                    <NuxtLink :to="'/read/' + data.slug" prefetch-on="interaction"
                        class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                        <Image :src="data.image_sm"
                            class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                        <div class="flex-1">
                            <div class="flex justify-start sm:justify-between gap-2 text-xs">
                                <AvatarPublishedAt :data class="text-xs" avatar_width="w-5 h-5" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <DefaultBody class="line-clamp-1 font-bold">{{ data.title }}</DefaultBody>
                                <DefaultBody class="line-clamp-3">{{ data.excerpt }}</DefaultBody>
                            </div>
                        </div>
                    </NuxtLink>
                </template>
                <template v-else v-for="m in 12" :key="m">
                    <div prefetch-on="interaction"
                        class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                        <div class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20" />
                        <div class="flex-1 flex flex-col gap-1">
                            <div class="h-5 w-3/4 bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton mt-3"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-1/2 bg-green-main/20 skeleton"></div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="flex justify-end items-start">
                <Pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { DefaultBody } from '#components';

const LatestArticleStore = useLatestArticleStore();
const { get } = LatestArticleStore;

// Server-side data fetching for SEO
const { public: { apiUri } } = useRuntimeConfig();
const { data: latestData } = await useFetch(`${apiUri}/v1/article/published`, {
    server: true,
    query: {
        page: 1,
        limit: 12
    }
});

// Set initial data in store if available
if (latestData.value) {
    LatestArticleStore.data = latestData.value as any;
}

const { isLoading, latest_articles, page, last_page, parameters } = storeToRefs(LatestArticleStore);
LatestArticleStore.authorId = undefined;

const sectionRef = ref<HTMLElement>();

watch(() => parameters.value.page, () => {
    get();

    if (sectionRef.value) {
        const headerOffset = 64 + 40; // pt-16 = 4rem = 64px
        const elementPosition = sectionRef.value.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
})
</script>

<style></style>
