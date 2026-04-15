<template>
    <section>
        <div class="flex flex-col gap-4">
            <div>
                <DefaultTitle>Cari</DefaultTitle>
                <DefaultSubtitle>Temukan artikel dan kegiatan</DefaultSubtitle>
            </div>

            <form @submit.prevent="submit" class="mb-6">
                <div class="relative max-w-xl">
                    <input ref="inputRef" v-model="input" type="search" enterkeyhint="search"
                        placeholder="Ketik kata kunci, tekan Enter…"
                        class="w-full px-4 py-3 pl-10 pr-4 border border-green-main/30 rounded-xl focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main" />
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </form>

            <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                <div v-for="m in 6" :key="m"
                    class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <div class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20 skeleton" />
                    <div class="flex-1 flex flex-col gap-1">
                        <div class="h-5 w-3/4 bg-green-main/20 skeleton" />
                        <div class="h-3 w-full bg-green-main/20 skeleton mt-3" />
                        <div class="h-3 w-full bg-green-main/20 skeleton" />
                        <div class="h-3 w-1/2 bg-green-main/20 skeleton" />
                    </div>
                </div>
            </div>

            <template v-else-if="q">
                <div v-if="!hasResults" class="text-center py-16">
                    <div class="text-6xl mb-4">🔍</div>
                    <div class="text-xl text-green-main/70 mb-1">Tidak ada hasil</div>
                    <div class="text-gray-500">Coba kata kunci lain untuk <strong>"{{ q }}"</strong></div>
                </div>

                <div v-else class="flex flex-col gap-10">
                    <div v-if="articles.length">
                        <div class="flex items-baseline justify-between mb-3">
                            <DefaultTitle>Artikel</DefaultTitle>
                            <span class="text-xs text-gray-500">{{ articles.length }} hasil</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                            <ArticleCard v-for="a in articles" :key="a.id" :data="a" />
                        </div>
                    </div>

                    <div v-if="events.length">
                        <div class="flex items-baseline justify-between mb-3">
                            <DefaultTitle>Kegiatan</DefaultTitle>
                            <span class="text-xs text-gray-500">{{ events.length }} hasil</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                            <EventCard v-for="e in events" :key="e.id" :data="e" />
                        </div>
                    </div>
                </div>
            </template>

            <div v-else class="text-center py-16">
                <div class="text-6xl mb-4">✨</div>
                <div class="text-xl text-green-main/70 mb-1">Mulai pencarian</div>
                <div class="text-gray-500">Masukkan kata kunci di atas untuk mencari artikel dan kegiatan</div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Article } from '~/interfaces/article-interface';
import type { Event } from '~/interfaces/event-interface';

interface SearchResponse {
    articles: Article[]
    events: Event[]
}

const route = useRoute();
const router = useRouter();

const q = computed(() => (route.query.q as string)?.trim() || '');
const input = ref(q.value);
const inputRef = ref<HTMLInputElement>();

watch(q, (v) => { input.value = v; });

const submit = () => {
    const v = input.value.trim();
    router.push({ path: '/search', query: v ? { q: v } : {} });
};

const { data, pending } = await useAsyncData<SearchResponse>(
    'search',
    () => q.value
        ? Api.get(`/v1/search?q=${encodeURIComponent(q.value)}&limit=20`) as Promise<SearchResponse>
        : Promise.resolve({ articles: [], events: [] }),
    { watch: [q] },
);

const articles = computed(() => data.value?.articles ?? []);
const events = computed(() => data.value?.events ?? []);
const hasResults = computed(() => articles.value.length + events.value.length > 0);

onMounted(() => { inputRef.value?.focus(); });

const { public: { webUri } } = useRuntimeConfig();
useSeoMeta({
    title: () => q.value ? `Cari: ${q.value} - Followers Bicara` : 'Cari - Followers Bicara',
    description: 'Cari artikel dan kegiatan di Followers Bicara.',
    ogUrl: webUri + '/search',
});
</script>

<style scoped>
input[type="search"]::-webkit-search-cancel-button {
    cursor: pointer;
}
</style>
