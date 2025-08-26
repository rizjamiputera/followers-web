<template>
    <section v-if="!isEmpty">
        <div class="flex flex-col gap-4">
            <DefaultTitle class="text-green-main">Artikel Terbaru</DefaultTitle>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                <template v-if="isEmpty && !isLoading">
                    <div class="col-span-full text-3xl text-center text-green-main/50">
                        Tidak ada article terbaru
                    </div>
                </template>
                <template v-for="(data, n) in latest_articles" :key="n">
                    <NuxtLink :to="'/read/' + data.slug" prefetch-on="interaction"
                        class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                        <Image :src="data.image_md"
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
                <Button class="btn btn-green" v-if="latest_articles.length < total" @click="++parameters.page; get()">
                    Lihat lebih banyak
                </Button>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { DefaultBody } from '#components';

const LatestArticleStore = useLatestArticleStore();
const { get, reset } = LatestArticleStore;

const { isLoading, latest_articles, total, page, last_page, parameters, isEmpty } = storeToRefs(LatestArticleStore);
LatestArticleStore.authorId = undefined;

// load first data
onMounted(() => {
    reset();
    get();
})

watch(() => parameters.value.page, () => {
    get();
})
</script>

<style></style>
