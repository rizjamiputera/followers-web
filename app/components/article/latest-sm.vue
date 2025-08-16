<template>
    <div class="flex flex-col gap-4">
        <div class="font-bold text-green-main">Artikel Terbaru {{ authorName }}</div>
        <template v-if="!isLoading" v-for="(data, n) in latestData" :key="n">
            <NuxtLink :to="'/read/' + data.slug" prefetch-on="interaction"
                class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                <Image :src="data.image_sm"
                    class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                <div class="flex-1 w-full">
                    <AvatarPublishedAt :data class="text-xs" avatar_width="w-5 h-5" />
                    <div class="flex flex-col gap-2 text-xs">
                        <div class="line-clamp-1 font-bold">{{ data.title }}</div>
                        <div class="line-clamp-2">{{ data.excerpt }}</div>
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
</template>

<script lang="ts" setup>
const props = defineProps<{
    authorId?: string
    authorName?: string
    exclude_slug?: string
}>()

const LatestArticleStore = useLatestArticleStore();
const { get } = LatestArticleStore;

const { data, isLoading, latest_articles, page, last_page, parameters, authorId } = storeToRefs(LatestArticleStore);
if (page.value != 1 && !data?.value) {
    if (props.authorId && authorId?.value != props.authorId) {
        LatestArticleStore.authorId = props.authorId;
        get()
    } else {
        get()
    }
}

const latestData = computed(() => {
    if (!props.exclude_slug) return latest_articles.value;

    return latest_articles.value.filter(d => d.slug != props.exclude_slug)
})
</script>

<style></style>
