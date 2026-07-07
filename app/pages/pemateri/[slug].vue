<template>
    <section>
        <!-- Not found -->
        <div v-if="isNotFound" class="text-center py-16">
            <div class="text-6xl mb-4">🔍</div>
            <div class="text-xl text-green-main/70 mb-2">Pemateri tidak ditemukan</div>
            <div class="text-gray-500">Pemateri yang Anda cari mungkin sudah tidak ada atau URL salah</div>
            <NuxtLink to="/pemateri" class="btn btn-green mt-4">Lihat Semua Pemateri</NuxtLink>
        </div>

        <div v-else-if="speaker" class="space-y-8">
            <!-- Header -->
            <div class="bg-gradient-to-r from-green-main/10 to-green-main/20 rounded-2xl p-6 md:p-8">
                <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <!-- Avatar -->
                    <div class="relative shrink-0">
                        <Image v-if="speaker.avatar_md" :src="speaker.avatar_md"
                            class="w-32 h-32 rounded-full bg-cover bg-center border-3 border-white shadow" />
                        <div v-else
                            class="w-32 h-32 rounded-full bg-gradient-to-br from-green-main/30 to-green-main/50 flex items-center justify-center border-3 border-white shadow">
                            <span class="text-5xl font-bold text-white">{{ speaker.name?.charAt(0)?.toUpperCase() }}</span>
                        </div>
                        <div v-if="speaker.verified"
                            class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-main rounded-full flex items-center justify-center border-3 border-white"
                            title="Terverifikasi">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 text-center md:text-left">
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                            <span v-if="speaker.honorific" class="font-medium">{{ speaker.honorific }}&nbsp;</span>{{ speaker.name }}<template
                                v-if="speaker.suffix">&nbsp;<span class="text-xl text-green-main/80" dir="rtl">{{ speaker.suffix }}</span></template>
                        </h1>
                        <p v-if="speaker.credentials" class="text-green-main/70 mb-3">{{ speaker.credentials }}</p>

                        <div class="flex justify-center md:justify-start items-center gap-6 mb-2">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-main">{{ speaker._count?.contents || contents.length }}</div>
                                <div class="text-sm text-gray-600">Kajian</div>
                            </div>
                        </div>

                        <!-- Linked user (also a platform writer) -->
                        <NuxtLink v-if="speaker.user?.username" :to="`/@${speaker.user.username}`"
                            class="inline-flex items-center gap-1 text-sm text-green-main hover:underline">
                            Juga penulis di sini &rarr;
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Bio -->
            <div v-if="speaker.bio" class="max-w-3xl">
                <h2 class="font-cinzel tracking-wide font-bold text-green-main mb-3">Tentang Pemateri</h2>
                <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ speaker.bio }}</p>
            </div>

            <!-- Kajian list -->
            <div>
                <h2 class="font-cinzel tracking-wide font-bold text-green-main mb-4">Kajian</h2>

                <div v-if="contents.length === 0" class="text-gray-500 italic py-6">
                    Belum ada kajian yang ditautkan ke pemateri ini.
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <template v-for="(c, n) in contents" :key="n">
                        <NuxtLink v-if="c.article" :to="`/read/${c.article.slug}`" prefetch-on="interaction"
                            class="group bg-white border border-green-main/20 rounded-xl overflow-hidden hover:shadow-lg hover:border-green-main/40 transition-all duration-300 hover:-translate-y-1">
                            <div class="aspect-video bg-green-main/10 overflow-hidden">
                                <Image v-if="c.article.image_md" :src="c.article.image_md"
                                    class="w-full h-full object-cover bg-cover bg-center" />
                            </div>
                            <div class="p-4">
                                <span class="inline-block text-xs text-green-main bg-green-main/10 rounded-full px-2 py-0.5 mb-2">Artikel</span>
                                <h3 class="font-bold text-gray-800 line-clamp-2 group-hover:text-green-main transition-colors">
                                    {{ c.article.title }}
                                </h3>
                                <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ c.article.excerpt }}</p>
                            </div>
                        </NuxtLink>

                        <NuxtLink v-else-if="c.event" :to="`/event/${c.event.slug}`" prefetch-on="interaction"
                            class="group bg-white border border-green-main/20 rounded-xl overflow-hidden hover:shadow-lg hover:border-green-main/40 transition-all duration-300 hover:-translate-y-1">
                            <div class="aspect-video bg-green-main/10 overflow-hidden">
                                <Image v-if="c.event.image_md" :src="c.event.image_md"
                                    class="w-full h-full object-cover bg-cover bg-center" />
                            </div>
                            <div class="p-4">
                                <span class="inline-block text-xs text-amber-700 bg-amber-100 rounded-full px-2 py-0.5 mb-2">Kegiatan</span>
                                <h3 class="font-bold text-gray-800 line-clamp-2 group-hover:text-green-main transition-colors">
                                    {{ c.event.title }}
                                </h3>
                                <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ c.event.excerpt }}</p>
                            </div>
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Speaker } from '~/interfaces/speaker-interface'

const route = useRoute()
const slug = route.params.slug as string

const { public: { apiUri, webUri } } = useRuntimeConfig()

const { data: speaker } = await useAsyncData<Speaker | null>(
    `pemateri-${slug}`,
    async () => {
        try {
            return await $fetch<Speaker>(`${apiUri}/v1/speakers/slug/${slug}`)
        } catch (e: any) {
            if (e?.response?.status === 404 || e?.statusCode === 404) return null
            throw e
        }
    },
)

const isNotFound = computed(() => !speaker.value)
const contents = computed(() => speaker.value?.contents ?? [])

const displayName = computed(() =>
    speaker.value
        ? [speaker.value.honorific, speaker.value.name].filter(Boolean).join(' ')
        : 'Pemateri',
)

onMounted(() => recordVisit())

useSeoMeta({
    title: () => (speaker.value ? `${displayName.value} - Pemateri` : 'Pemateri tidak ditemukan'),
    ogTitle: () => (speaker.value ? `${displayName.value} - Pemateri` : 'Pemateri tidak ditemukan'),
    description: () =>
        speaker.value?.bio ||
        (speaker.value ? `Kajian bersama ${displayName.value} di Followers Bicara.` : 'Pemateri tidak ditemukan'),
    ogImage: () => speaker.value?.avatar_md ?? (webUri + '/logo-hitam.jpg'),
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: () => `${webUri}/pemateri/${slug}`,
})
</script>

<style></style>
