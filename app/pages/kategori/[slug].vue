<template>
    <section v-if="category" class="section-container">
        <div class="flex flex-col gap-2 mb-6">
            <DefaultTitle class="text-green-main">{{ category.name }}</DefaultTitle>
            <DefaultSubtitle v-if="category.description">
                {{ category.description }}
            </DefaultSubtitle>
            <div class="text-xs opacity-60">
                {{ total }} artikel · {{ eventTotal }} kegiatan
            </div>
        </div>

        <div class="flex flex-col gap-4 mb-10">
            <div v-if="articles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                <NuxtLink v-for="a in articles" :key="a.id" :to="`/read/${a.slug}`" prefetch-on="interaction"
                    class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <Image :src="a.image_md"
                        class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                    <div class="flex-1 flex flex-col gap-2">
                        <AvatarPublishedAt :data="a" class="text-xs" avatar_width="w-5 h-5" />
                        <div class="flex-1 flex flex-col gap-2">
                            <DefaultBody class="line-clamp-1 font-bold">{{ a.title }}</DefaultBody>
                            <DefaultBody class="line-clamp-3">{{ a.excerpt }}</DefaultBody>
                        </div>
                        <TagList v-if="a.tags?.length" :tags="a.tags" :clickable="false" size="sm" />
                    </div>
                </NuxtLink>
            </div>
            <div v-else-if="!pending" class="text-center text-green-main/60 py-10">
                Belum ada artikel dalam kategori ini.
            </div>

            <div v-if="articles.length < total" class="flex justify-center">
                <button class="btn btn-green font-cinzel tracking-wide" @click="loadMore" :disabled="loadingMore">
                    {{ loadingMore ? 'Memuat...' : 'Lihat lebih banyak' }}
                </button>
            </div>
        </div>

        <div v-if="events.length > 0" class="mt-10">
            <DefaultTitle class="text-green-main mb-3">Kegiatan</DefaultTitle>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <EventCard v-for="e in events" :key="e.id" :data="e" />
            </div>
        </div>
    </section>

    <section v-else class="section-container text-center py-20">
        <div class="text-lg text-green-main/80">Kategori tidak ditemukan</div>
        <NuxtLink to="/" class="btn btn-sm btn-green mt-4">Kembali</NuxtLink>
    </section>
</template>

<script lang="ts" setup>
import type { Paginate } from '~/interfaces/app-interface'
import type { Article } from '~/interfaces/article-interface'
import type { Event } from '~/interfaces/event-interface'

const route = useRoute()
const slug = route.params.slug as string
const { public: { apiUri, webUri } } = useRuntimeConfig()

const CategoriesStore = useCategoriesStore()
if (!CategoriesStore.loaded) await CategoriesStore.fetch()
const category = computed(() => CategoriesStore.findBySlug(slug))

const LIMIT = 12
const page = ref(1)
const loadingMore = ref(false)

const { data, pending } = await useAsyncData(
    `kategori-${slug}`,
    async () => {
        const [articlesRes, eventsRes] = await Promise.all([
            $fetch<Paginate<Article[]>>(`${apiUri}/v1/article/published`, {
                query: {
                    categorySlug: slug,
                    limit: LIMIT,
                    page: 1,
                    includes: 'author,tags.tag,category',
                    sortBy: 'publishedAt',
                    order: 'desc',
                },
            }),
            $fetch<Paginate<Event[]>>(`${apiUri}/v1/event/published`, {
                query: {
                    categorySlug: slug,
                    limit: 6,
                    page: 1,
                    includes: 'author,category',
                    sortBy: 'start_at',
                    order: 'desc',
                },
            }).catch(() => ({ data: [], total: 0 }) as any),
        ])

        return {
            articles: articlesRes.data,
            total: articlesRes.total,
            events: eventsRes.data,
            eventTotal: eventsRes.total,
        }
    }
)

const articles = ref<Article[]>(data.value?.articles ?? [])
const events = computed<Event[]>(() => data.value?.events ?? [])
const total = computed<number>(() => data.value?.total ?? 0)
const eventTotal = computed<number>(() => data.value?.eventTotal ?? 0)

async function loadMore() {
    if (loadingMore.value) return
    loadingMore.value = true
    page.value += 1
    try {
        const res = await $fetch<Paginate<Article[]>>(`${apiUri}/v1/article/published`, {
            query: {
                categorySlug: slug,
                limit: LIMIT,
                page: page.value,
                includes: 'author,tags.tag,category',
                sortBy: 'publishedAt',
                order: 'desc',
            },
        })
        articles.value.push(...res.data)
    } catch (e) {
        console.error(e)
    } finally {
        loadingMore.value = false
    }
}

useSeoMeta({
    title: () => category.value ? `${category.value.name} — Followers Bicara` : 'Kategori tidak ditemukan',
    description: () => category.value?.description ?? 'Konten dakwah berdasarkan kategori.',
    ogTitle: () => category.value ? `${category.value.name} — Followers Bicara` : 'Kategori',
    ogDescription: () => category.value?.description ?? '',
    ogImage: () => webUri + '/logo-hitam.jpg',
    ogUrl: () => `${webUri}/kategori/${slug}`,
    ogSiteName: 'FollowersBicara.com',
    twitterCard: 'summary_large_image',
})
</script>
