<template>
    <section>
        <div class="flex flex-col gap-4">
            <div>
                <DefaultTitle>Pemateri</DefaultTitle>
                <DefaultSubtitle>العلماء ورثة الانبياء</DefaultSubtitle>
            </div>

            <!-- Search Bar -->
            <div class="mb-6">
                <div class="relative max-w-md">
                    <input v-model="search" type="text" placeholder="Cari pemateri..."
                        class="w-full px-4 py-3 pl-10 pr-4 border border-green-main/30 rounded-xl focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main" />
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                <template v-if="isEmpty && !isLoading">
                    <div class="col-span-full text-center py-12">
                        <div class="text-6xl mb-4">🎙️</div>
                        <div class="text-xl text-green-main/70 mb-2">Belum ada pemateri</div>
                        <div class="text-gray-500">Pemateri akan muncul di sini setelah ditautkan ke kajian</div>
                    </div>
                </template>

                <template v-for="(speaker, n) in speakers" :key="speaker.slug || n">
                    <NuxtLink :to="`/pemateri/${speaker.slug}`" prefetch-on="interaction"
                        class="group bg-white border border-green-main/20 rounded-xl p-4 hover:shadow-lg hover:border-green-main/40 transition-all duration-300 hover:-translate-y-1">

                        <!-- Avatar -->
                        <div class="flex justify-center mb-4">
                            <div class="relative">
                                <Image v-if="speaker.avatar_md" :src="speaker.avatar_md"
                                    class="w-20 h-20 rounded-full bg-cover bg-center border-3 border-green-main/20 group-hover:border-green-main/40 transition-colors" />
                                <div v-else
                                    class="w-20 h-20 rounded-full bg-gradient-to-br from-green-main/20 to-green-main/40 flex items-center justify-center border-3 border-green-main/20">
                                    <span class="text-2xl font-bold text-green-main">{{
                                        speaker.name?.charAt(0)?.toUpperCase() }}</span>
                                </div>
                                <!-- Verification badge -->
                                <div v-if="speaker.verified"
                                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-main rounded-full flex items-center justify-center"
                                    title="Terverifikasi">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Name -->
                        <div class="text-center mb-3">
                            <h3
                                class="font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-green-main transition-colors">
                                <span v-if="speaker.honorific" class="font-medium">{{ speaker.honorific }} </span>{{ speaker.name }}
                            </h3>
                            <p v-if="speaker.credentials" class="text-sm text-gray-500 line-clamp-1">
                                {{ speaker.credentials }}
                            </p>
                        </div>

                        <!-- Kajian count -->
                        <div class="flex justify-center items-center gap-1 text-sm text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                            {{ speaker._count?.contents || 0 }} kajian
                        </div>
                    </NuxtLink>
                </template>

                <!-- Loading skeletons -->
                <template v-if="isLoading">
                    <div v-for="m in 8" :key="`sk-${m}`"
                        class="bg-white border border-green-main/20 rounded-xl p-4 animate-pulse">
                        <div class="flex justify-center mb-4">
                            <div class="w-20 h-20 rounded-full bg-green-main/20"></div>
                        </div>
                        <div class="text-center mb-3">
                            <div class="h-5 bg-green-main/20 rounded w-3/4 mx-auto mb-2"></div>
                            <div class="h-4 bg-green-main/20 rounded w-1/2 mx-auto"></div>
                        </div>
                        <div class="flex justify-center">
                            <div class="h-4 bg-green-main/20 rounded w-20"></div>
                        </div>
                    </div>
                </template>
            </div>

            <div class="flex justify-center mt-8">
                <Button v-if="speakers.length < total && !isLoading"
                    class="btn btn-green font-cinzel tracking-wide px-8 py-3 text-lg" @click="loadMore">
                    Lihat lebih banyak
                </Button>
                <div v-else-if="speakers.length >= total && speakers.length > 0" class="text-center text-gray-500">
                    <div class="text-2xl mb-2">✨</div>
                    <p>Semua pemateri telah ditampilkan</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Paginate } from '~/interfaces/app-interface'
import type { Speaker } from '~/interfaces/speaker-interface'

const { public: { apiUri, webUri } } = useRuntimeConfig()

const LIMIT = 12

// useState keeps the accumulated list serialized across SSR -> client hydration
const speakers = useState<Speaker[]>('pemateri-list', () => [])
const total = useState<number>('pemateri-total', () => 0)
const page = ref(1)
const search = ref('')
const isLoading = ref(false)

const isEmpty = computed(() => speakers.value.length === 0)

async function load(reset: boolean) {
    isLoading.value = true
    try {
        const res = await $fetch<Paginate<Speaker[]>>(`${apiUri}/v1/speakers`, {
            query: {
                page: page.value,
                limit: LIMIT,
                search: search.value || undefined,
                sortBy: 'name',
                order: 'asc',
            },
        })
        total.value = res.total
        speakers.value = reset ? res.data : [...speakers.value, ...res.data]
    } finally {
        isLoading.value = false
    }
}

// Initial SSR fetch (awaited so the payload hydrates without a client refetch)
await useAsyncData('pemateri-initial', async () => {
    page.value = 1
    await load(true)
    return true
})

// Debounced search (client-side)
let searchTimeout: ReturnType<typeof setTimeout>
watch(search, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        page.value = 1
        load(true)
    }, 500)
})

function loadMore() {
    page.value++
    load(false)
}

onMounted(() => recordVisit())

// SEO
const title = 'Pemateri - Followers Bicara'
const description = 'Daftar pemateri kajian—para ustadz dan pemateri yang ilmunya menjadi bacaan di Followers Bicara.'
useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => webUri + '/logo-hitam.jpg',
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: webUri + '/pemateri',
})
</script>

<style></style>
