<template>
    <section class="mt-10">
        <div class="flex items-end justify-between gap-2 mb-3">
            <div>
                <DefaultTitle>
                    <span class="text-green-main">{{ category.name }}</span>
                </DefaultTitle>
                <DefaultSubtitle v-if="category.description">
                    {{ category.description }}
                </DefaultSubtitle>
            </div>
            <NuxtLink :to="`/kategori/${category.slug}`" prefetch-on="interaction"
                class="text-sm text-green-main hover:underline font-medium whitespace-nowrap">
                Lihat semua →
            </NuxtLink>
        </div>

        <div v-if="pending && articles.length === 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            <div v-for="m in 3" :key="m"
                class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                <div class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20 skeleton" />
                <div class="flex-1 flex flex-col gap-1">
                    <div class="h-5 w-3/4 bg-green-main/20 skeleton" />
                    <div class="h-3 w-full bg-green-main/20 skeleton mt-3" />
                    <div class="h-3 w-full bg-green-main/20 skeleton" />
                </div>
            </div>
        </div>

        <div v-else-if="articles.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            <NuxtLink v-for="a in articles" :key="a.id" :to="`/read/${a.slug}`" prefetch-on="interaction"
                class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                <Image :src="a.image_md"
                    class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                <div class="flex-1 flex flex-col gap-2">
                    <AvatarPublishedAt :data="a" class="text-xs" avatar_width="w-5 h-5" />
                    <div class="flex-1 flex flex-col gap-2">
                        <DefaultBody class="line-clamp-1 font-bold">{{ a.title }}</DefaultBody>
                        <DefaultBody class="line-clamp-2">{{ a.excerpt }}</DefaultBody>
                    </div>
                </div>
            </NuxtLink>
        </div>

        <div v-else class="text-center text-green-main/60 py-6 text-sm">
            Belum ada artikel dalam kategori ini.
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Paginate } from '~/interfaces/app-interface'
import type { Article } from '~/interfaces/article-interface'
import type { Category } from '~/interfaces/category-interface'

const props = defineProps<{
    category: Category
}>()

const { public: { apiUri } } = useRuntimeConfig()

// SSR-safe fetch, keyed by slug so Nuxt caches each section's payload
// separately and hydration works on the client without re-fetching.
const { data, pending } = await useAsyncData(
    `home-cat-${props.category.slug}`,
    () => $fetch<Paginate<Article[]>>(`${apiUri}/v1/article/published`, {
        query: {
            categorySlug: props.category.slug,
            limit: 3,
            page: 1,
            includes: 'author,tags.tag',
            sortBy: 'publishedAt',
            order: 'desc',
        },
    })
)

const articles = computed<Article[]>(() => data.value?.data ?? [])
</script>
