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
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-end items-center gap-1 text-xs">
                            <LucideClock :size="12" /> {{ getRelativeTime(data.publishedAt!) }}
                        </div>
                        <Image :src="data.image" :alt="data.title" class-name="aspect-video bg-cover rounded-2xl" />
                        <div class="text-2xl md:text-3xl font-semibold">{{ data.title }}</div>
                        <div class="flex justify-between">
                            <LazyAvatarName v-if="data.author" :user="data.author" avatar_width="w-10 h-10" />

                            <div class="flex items-center gap-2">
                                <div class="join join-vertical lg:join-horizontal">
                                    <button class="btn btn-sm join-item font-light rounded-l-full">
                                        <LucideThumbsUp :size="14" /> {{ stats.likeCount }}
                                    </button>
                                    <button class="btn btn-sm join-item font-light rounded-r-full">
                                        <LucideThumbsDown :size="14" /> {{ stats.dislikeCount }}
                                    </button>
                                </div>
                                <div class="join join-vertical lg:join-horizontal">
                                    <button @click="handleShare" class="btn btn-sm join-item font-light rounded-l-full">
                                        <LucideShare2 :size="14" /> {{ stats.shareCount }}
                                    </button>
                                    <button class="btn btn-sm join-item font-light rounded-r-full">
                                        <LucideBookmark :size="14" /> {{ stats.bookmarkCount }}
                                    </button>
                                </div>

                                <div class="text-sm font-light">{{ stats.readCount }} views</div>
                            </div>
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
            <div class="col-span-full md:col-span-3">

                <LazyArticleLatestSm v-if="data" :authorId="data.authorId" :authorName="data.author?.name"
                    :exclude_slug="data.slug" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { LucideBookmark, LucideClock, LucideShare, LucideShare2, LucideThumbsDown, LucideThumbsUp } from 'lucide-vue-next';

const route = useRoute();
const ReadArticleStore = useReadArticleStore();
const { data, tags, content, stats } = storeToRefs(ReadArticleStore);
const { get } = ReadArticleStore;
ReadArticleStore.slug = route.params.slug as string;

ReadArticleStore.data = undefined;
get()

const handleShare = async () => {
    if (!ReadArticleStore.data) return;

    const shareData = {
        title: ReadArticleStore.data.title,
        text: ReadArticleStore.data.title,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    }
};
</script>

<style></style>
