<template>
    <section>
        <!-- CATEGORY + TAGS -->
        <div class="flex flex-wrap gap-2 items-center">
            <NuxtLink v-if="data?.category" :to="`/kategori/${data.category.slug}`" prefetch-on="interaction"
                class="badge badge-success text-white bg-green-main border-0 rounded-full">
                {{ data.category.name }}
            </NuxtLink>
            <template v-for="tag in tags" :key="tag.id">
                <div
                    class="badge badge-success badge-ghost badge-outline border-green-main/20 text-green-main capitalize rounded-full line-clamp-1 text-ellipsis">
                    {{ tag.name }}
                </div>
            </template>
        </div>
        <div v-if="isNotFound" class="text-lg text-center font-light text-green-main/80">
            Artikel tidak ditemukan
        </div>

        <div class="grid grid-cols-10 gap-4 md:gap-8 mt-5">
            <div class="col-span-full md:col-span-7 flex flex-col gap-4">
                <template v-if="data">
                    <!-- ARTICLE IMAGE -->
                    <div class="flex flex-col gap-1">
                        <div class="text-2xl md:text-3xl font-semibold mb-1">
                            {{ data.title }}
                        </div>
                        <div class="flex justify-end items-center gap-1 text-xs font-light">
                            <LucideClock :size="12" /> {{ data.publishedAt ? getRelativeTime(data.publishedAt) : '-' }}
                            <div class="">{{ stats?.readCount ?? 0 }} views</div>
                        </div>
                        <Image :src="data.image" :alt="data.title" class-name="aspect-video bg-cover rounded-2xl" />
                        <div class="flex flex-wrap justify-center sm:justify-between gap-2">
                            <div v-if="data.author" class="flex items-center gap-2">
                                <LazyAvatarName :user="data.author" avatar_width="w-10 h-10" />
                                <LazyFollowButton :userId="data.authorId" />
                            </div>

                            <div class="flex items-center gap-2">
                                <div class="join join-horizontal">
                                    <button class="btn btn-xs sm:btn-sm join-item font-light rounded-l-full"
                                        @click="handleLike">
                                        <LucideThumbsUp :size="14"
                                            :class="{ 'fill-rose-400 stroke-rose-400': auth_reaction == 'like' }" /> {{
                                                stats?.likeCount ?? 0 }}
                                    </button>
                                    <button class="btn btn-xs sm:btn-sm join-item font-light rounded-r-full"
                                        @click="handleDislike">
                                        <LucideThumbsDown :size="14"
                                            :class="{ 'fill-rose-400 stroke-rose-400': auth_reaction == 'dislike' }" />
                                    </button>
                                </div>
                                <div class="join join-horizontal">
                                    <button @click="handleShare"
                                        class="btn btn-xs sm:btn-sm join-item font-light rounded-l-full">
                                        <LucideShare2 :size="14" /> {{ stats?.shareCount ?? 0 }}
                                    </button>
                                    <button @click="shareToWhatsApp" class="btn btn-xs sm:btn-sm join-item font-light">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z" />
                                        </svg>
                                    </button>
                                    <button class="btn btn-xs sm:btn-sm join-item font-light rounded-r-full"
                                        @click="handleBookmark">
                                        <LucideBookmark :size="14"
                                            :class="{ 'fill-rose-400 stroke-rose-400': auth_bookmarked }" />
                                        {{ stats?.bookmarkCount ?? 0 }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- PEMATERI -->
                    <div v-if="data.speakers && data.speakers.length" class="text-sm">
                        <span class="font-medium text-gray-500">Pemateri: </span>
                        <template v-for="(sp, i) in data.speakers" :key="sp.id"><NuxtLink :to="`/pemateri/${sp.slug}`"
                                prefetch-on="interaction"
                                class="font-medium text-gray-800 hover:text-green-main transition-colors"><span
                                    v-if="sp.honorific" class="font-normal text-gray-500">{{ sp.honorific }}&nbsp;</span>{{ sp.name }}<template
                                    v-if="sp.suffix">&nbsp;<span class="text-gray-400" dir="rtl">{{ sp.suffix }}</span></template></NuxtLink><span
                                v-if="i < data.speakers.length - 1" class="text-gray-400">, </span></template>
                    </div>

                    <!-- content -->
                    <div v-if="content" class="prose max-w-none">
                        <WysiwygRenderer :content="content" />
                    </div>
                    <div v-else>
                        <div class="flex-1 flex flex-col gap-1">
                            <div class="h-5 w-3/4 bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton mt-3"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-1/2 bg-green-main/20 skeleton"></div>
                        </div>
                    </div>

                    <LazyContentComments v-if="contentId" :contentId :stats @add-comment="getStats" />
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
import { LucideBookmark, LucideClock, LucideShare2, LucideThumbsDown, LucideThumbsUp } from 'lucide-vue-next';
import type { Article } from '~/interfaces/article-interface';
import { ReactionType } from '~/interfaces/content-interface';

const route = useRoute();
const ReadArticleStore = useReadArticleStore();
const { data, tags, content, stats, isNotFound, auth_reaction, auth_bookmarked, contentId } = storeToRefs(ReadArticleStore);
const { getStats, recordVisit } = ReadArticleStore;
const slug = route.params.slug as string;
ReadArticleStore.slug = slug;

const { public: { apiUri, webUri } } = useRuntimeConfig();

// Single SSR + client-hydration fetch with all includes. Same payload
// serves the crawler (SEO) and the in-browser reader — no duplicate fetch.
const { data: article, error } = await useAsyncData(
    `article-${slug}`,
    async () => {
        try {
            return await $fetch<Article & { stats?: any }>(`${apiUri}/v1/article/read/${slug}`, {
                query: { includes: 'content,author,tags.tag,stats,category,speakers.speaker' },
                headers: Api.headers(),
            });
        } catch (e: any) {
            if (e?.response?.status === 404 || e?.statusCode === 404) return null;
            throw e;
        }
    }
);

if (!article.value) {
    ReadArticleStore.isNotFound = true;
} else {
    const { stats: _stats, ...rest } = article.value as any;
    ReadArticleStore.data = rest;
    ReadArticleStore.stats = _stats;
}

// Visit is a side-effect, not a data fetch — keep client-only.
onMounted(() => {
    recordVisit(route.path);
})

useSeoMeta({
    title: () => data?.value?.title ?? '-',
    ogTitle: () => data?.value?.title ?? '-',
    description: () => data?.value?.excerpt ?? '-',
    ogDescription: () => data?.value?.excerpt ?? '-',
    ogImage: () => data?.value?.image_md ?? (webUri + '/logo-hitam.jpg'),
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: webUri + '/read/' + route.params.slug
});

useHead({
    link: [{ rel: 'canonical', href: `${webUri}/read/${slug}` }],
    script: article.value ? [
        {
            type: 'application/ld+json',
            id: 'article-jsonld',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: article.value.title,
                description: article.value.excerpt,
                image: article.value.image_md || `${webUri}/logo-hitam.jpg`,
                datePublished: article.value.publishedAt,
                url: `${webUri}/read/${slug}`,
                mainEntityOfPage: { '@type': 'WebPage', '@id': `${webUri}/read/${slug}` },
                author: (article.value as any).author ? {
                    '@type': 'Person',
                    name: (article.value as any).author.name,
                    url: `${webUri}/creator/${(article.value as any).author.username}`,
                } : undefined,
                publisher: {
                    '@type': 'Organization',
                    name: 'FollowersBicara',
                    logo: { '@type': 'ImageObject', url: `${webUri}/logo.svg` },
                },
            }),
        },
    ] : [],
});

const handleShare = async () => {
    if (!data?.value) return;

    await ReadArticleStore.recordShare();
    getStats();

    const shareData = {
        title: data.value.title,
        text: data.value.title,
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

const shareToWhatsApp = async () => {
    if (!data?.value) return;
    await ReadArticleStore.recordShare();
    getStats();

    const text = encodeURIComponent(`${data.value.title} ${window.location.href}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;

    window.open(whatsappUrl, '_blank');
};

const AuthStore = useAuthStore();
const handleBookmark = async () => {
    if (!ReadArticleStore.data) return;

    if (!AuthStore.user) {
        AuthStore.show_request_login = true;
        return;
    }

    try {
        if (!auth_bookmarked.value) {
            await Api.post('/v1/article/bookmark/' + ReadArticleStore.data.id)
            ReadArticleStore.data.authBookmark = true;
        } else {
            await Api.post('/v1/article/unbookmark/' + ReadArticleStore.data.id)
            ReadArticleStore.data.authBookmark = false;
        }
        getStats();
    } catch (error) {
    }
}

const handleDislike = async () => {
    if (!ReadArticleStore.data) return;

    if (!AuthStore.user) {
        AuthStore.show_request_login = true;
        return;
    }

    try {
        await Api.post('/v1/article/react/' + ReadArticleStore.data.id, { type: 'dislike' });
        getStats();
        ReadArticleStore.data.auth_reaction = { type: ReactionType.dislike }
    } catch (error) {
    }
}

const handleLike = async () => {
    if (!ReadArticleStore.data) return;

    if (!AuthStore.user) {
        AuthStore.show_request_login = true;
        return;
    }

    try {
        await Api.post('/v1/article/react/' + ReadArticleStore.data.id, { type: 'like' });
        getStats();
        ReadArticleStore.data.auth_reaction = { type: ReactionType.like }
    } catch (error) {
    }
}
</script>

<style></style>
