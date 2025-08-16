<template>
    <section>
        <!-- TAGS -->
        <div class="flex flex-wrap gap-2">
            <template v-for="tag in tags" :key="tag.id">
                <div
                    class="badge badge-success badge-ghost badge-outline border-green-main/20 text-green-main capitalize rounded-full line-clamp-1 text-ellipsis">
                    {{
                        tag.name }}</div>
            </template>
        </div>
        <div class="grid grid-cols-10 gap-5 md:gap-10 mt-5">
            <div class="col-span-full md:col-span-7 flex flex-col gap-4">
                <template v-if="data">
                    <!-- ARTICLE IMAGE -->
                    <div class="text-2xl md:text-3xl font-semibold">{{ data.title }}</div>
                    <div>
                        <Image :src="data.image" :alt="data.title" class-name="aspect-video bg-cover rounded-2xl" />
                        <AvatarPublishedAt :data avatar_width="w-10 h-10" class="mt-2" />
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <div class="flex items-center text-xs">
                            <button @click="" class="btn btn-xs btn-circle btn-ghost">
                                <LucideThumbsUp :size="14" />
                            </button>
                            180
                        </div>
                        <div class="flex items-center text-xs">
                            <button @click="" class="btn btn-xs btn-circle btn-ghost">
                                <LucideThumbsDown :size="14" />
                            </button>
                            180
                        </div>
                    </div>

                    <!-- content -->
                    <div v-if="content" class="prose max-w-none">
                        <WysiwygRenderer :content="content" />
                    </div>

                    <ArticleComments :articleId="data.id" />
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
import { LucideThumbsDown, LucideThumbsUp } from 'lucide-vue-next';

const route = useRoute();
const ReadArticleStore = useReadArticleStore();
const { data, tags, content } = storeToRefs(ReadArticleStore);
const { get } = ReadArticleStore;
ReadArticleStore.slug = route.params.slug as string;

ReadArticleStore.data = undefined;
get()
</script>

<style></style>
