<template>
    <section>
        <div class="flex flex-col gap-4">
            <div>
                <DefaultTitle>Artikel <span class="text-green-main">Terbaru</span></DefaultTitle>
                <DefaultSubtitle>Pelajari ilmu sebanyak mungkin sebagai bekal kita kelak</DefaultSubtitle>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                <template v-if="isEmpty && !isLoading">
                    <div class="col-span-full text-3xl text-center text-green-main/50">
                        Tidak ada article terbaru
                    </div>
                </template>
                <ArticleCard v-for="(data, n) in latest_articles" :key="n" :data="data" />
                <template v-if="isLoading" v-for="m in 6" :key="m">
                    <div class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                        <div class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20 skeleton" />
                        <div class="flex-1 flex flex-col gap-1">
                            <div class="h-5 w-3/4 bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton mt-3"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-1/2 bg-green-main/20 skeleton"></div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="flex justify-center">
                <Button class="btn btn-green font-cinzel tracking-wide" v-if="latest_articles.length < total"
                    @click="++parameters.page">
                    Lihat lebih banyak
                </Button>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const LatestArticleStore = useLatestArticleStore();
const { get } = LatestArticleStore;

const { isLoading, latest_articles, total, page, last_page, parameters, isEmpty } = storeToRefs(LatestArticleStore);
LatestArticleStore.authorId = undefined;

// SSR the first page so crawlers see real articles in the initial HTML.
// Pinia hydration carries the state to the client — no re-fetch on mount.
await useAsyncData('latest-articles-initial', async () => {
    LatestArticleStore.reset();
    await LatestArticleStore.get();
    return true;
});

watch(() => parameters.value.page, () => {
    get();
})
</script>

<style></style>
