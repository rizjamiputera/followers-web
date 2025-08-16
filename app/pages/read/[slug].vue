<template>
    <section>
        <!-- TAGS -->
        <div class="flex gap-2">
            <template v-for="tag in tags" :key="tag.id">
                <div class="badge badge-neutral capitalize rounded-full">{{ tag.name }}</div>
            </template>
        </div>
        <div class="grid grid-cols-10 gap-5 md:gap-10 mt-5">
            <div class="col-span-full md:col-span-7 flex flex-col gap-4">
                <template v-if="data">
                    <!-- ARTICLE IMAGE -->
                    <div class="text-2xl md:text-3xl font-semibold">{{ data.title }}</div>
                    <div>
                        <Image :src="data.image" :alt="data.title" class-name="aspect-video bg-cover rounded-2xl" />
                        <AvatarPublishedAt :data avatar_class="w-12 h-12" class="mt-2" />
                    </div>

                    <!-- content -->
                    <div v-if="data.content?.content" class="prose max-w-none">
                        <WysiwygRenderer :content="data.content.content" />
                    </div>
                </template>
            </div>
            <!-- SIDE RIGHT -->
            <div class="col-span-full md:col-span-3 min-h-screen">

                <LazyArticleLatestSm v-if="data" :authorId="data.authorId" :authorName="data.author?.name"
                    :exclude_slug="data.slug" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const route = useRoute();
const ReadArticleStore = useReadArticleStore();
const { data, tags } = storeToRefs(ReadArticleStore);
const { get } = ReadArticleStore;
ReadArticleStore.slug = route.params.slug as string;

ReadArticleStore.data = undefined;
get()
</script>

<style></style>
