<template>
    <div ref="sectionRef">
        <CpContentTable title="My Article" :loading="isLoading" :empty="isEmpty" :colspan="4">
            <template #search>
                <div class="flex gap-2 w-full sm:w-auto">
                    <Input v-model="search" placeholder="Cari artikel.." class="input-sm flex-1 sm:w-72" />
                    <ButtonLink to="/cp/my-articles/form" class="btn-green btn-sm text-nowrap">
                        + Artikel Baru
                    </ButtonLink>
                </div>
            </template>
            <template #toolbar>
                <CpContentFilters
                    hide-search
                    v-model:status="filterStatus"
                    v-model:tag-slug="filterTagSlug"
                    v-model:category-id="filterCategoryId" />
            </template>

            <template #head>
                <th>Article</th>
                <th class="text-center">Status</th>
                <th class="text-center">Publish</th>
                <th class="text-center">Action</th>
            </template>

            <template #rows>
                <tr v-for="dt in articles" :key="dt.id">
                    <td>
                        <CpContentTitleCell :image="dt.image_md || dt.image" :title="dt.title">
                            <CpContentStats :stats="dt.stats" class="mt-1" />
                        </CpContentTitleCell>
                    </td>
                    <td class="text-center">
                        <StatusBade :status="dt.status" />
                    </td>
                    <td class="text-center">
                        <div class="flex gap-1 justify-center">
                            <Button v-if="canApprove && ['ON_REVIEW', 'REJECTED', 'TAKE_DOWN'].includes(dt.status)"
                                class="btn-sm btn-primary"
                                @click="selectedArticleId = dt.id; showConfirmApprove = true">Approve</Button>
                            <Button
                                v-if="canPublish && (['ON_REVIEW', 'APPROVED', 'REJECTED', 'TAKE_DOWN'].includes(dt.status) || (dt.status == 'PUBLISHED' && dt.publishedAt == null))"
                                class="btn-sm btn-success"
                                @click="selectedArticleId = dt.id; showConfirmPublish = true">
                                {{ dt.status == 'PUBLISHED' && dt.publishedAt == null ? 'Atur Jadwal Publish' : 'Publish' }}
                            </Button>
                            <span class="text-nowrap text-sm text-gray-600"
                                v-if="dt.status == 'PUBLISHED' && dt.publishedAt != null">
                                {{ dt.publishedAt ? formatDateTimeTz(dt.publishedAt) : '-' }}
                            </span>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="flex gap-1 justify-center">
                            <Button class="btn-sm btn-ghost btn-square" title="Preview" @click="get_preview(dt.id)">
                                <LucideEye :size="16" />
                            </Button>
                            <ButtonLink :to="`/cp/my-articles/form?id=${dt.id}`" class="btn-sm btn-ghost btn-square"
                                title="Edit">
                                <LucideSquarePen :size="16" />
                            </ButtonLink>
                            <ButtonLink v-if="dt.status == 'PUBLISHED'" :to="`/read/${dt.slug}`" target="_blank"
                                class="btn-sm btn-ghost btn-square" title="Buka">
                                <LucideExternalLink :size="16" />
                            </ButtonLink>
                            <Button class="btn-sm btn-ghost btn-square text-error"
                                v-if="canPublish && dt.status == 'PUBLISHED'" title="Take down"
                                @click="selectedArticleId = dt.id; showConfirmTakeDown = true">
                                <LucideArchive :size="16" />
                            </Button>
                        </div>
                    </td>
                </tr>
            </template>

            <template #footer>
                <div class="flex justify-center">
                    <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />
                </div>
            </template>
        </CpContentTable>
    </div>

    <LazyModal v-if="show_preview" :show="show_preview" @close="show_preview = false" max-width="max-w-4xl">
        <div class="p-4" v-if="selectedPreview">
            <ArticlePreview :data="selectedPreview" />
        </div>
    </LazyModal>

    <!-- approve -->
    <LazySetApproveModal v-if="canApprove && selectedArticleId && showConfirmApprove" :show="showConfirmApprove"
        type="article" :dataId="selectedArticleId" @close="showConfirmApprove = false"
        @submited="showConfirmApprove = false; get(false)" />

    <!-- publish -->
    <LazySetPublishModal v-if="canPublish && selectedArticleId && showConfirmPublish" :show="showConfirmPublish"
        type="article" :dataId="selectedArticleId" @close="showConfirmPublish = false"
        @submited="showConfirmPublish = false; get(false)" />

    <!-- take down -->
    <LazySetTakeDown v-if="canPublish && showConfirmTakeDown && selectedArticleId" :show="showConfirmTakeDown"
        type="article" :dataId="selectedArticleId" @close="showConfirmTakeDown = false"
        @submited="showConfirmTakeDown = false; get(false)" />

    <LazySetRequestReview v-if="canWrite && showConfirmRequestReview && selectedArticleId" type="article"
        :show="showConfirmRequestReview" :dataId="selectedArticleId" @close="showConfirmRequestReview = false"
        @submited="showConfirmRequestReview = false; get(false)" />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideEye, LucideExternalLink, LucideSquarePen, LucideArchive } from 'lucide-vue-next';
import type { Article } from '~/interfaces/article-interface';
import type { ContentStatus } from '~/interfaces/content-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.ARTICLE, Permission.CREATE)) {
                return navigateTo('/cp')
            }
        }
    ]
});

const AuthStore = useAuthStore();
const canWrite = computed(() => AuthStore.can(Module.ARTICLE, Permission.CREATE));
const canApprove = computed(() => AuthStore.can(Module.ARTICLE, Permission.APPROVE));
const canPublish = computed(() => AuthStore.can(Module.ARTICLE, Permission.PUBLISH));

const MyArticlesStore = useMyArticlesStore()
const { articles, page, last_page, parameters, isEmpty, isLoading, search } = storeToRefs(MyArticlesStore);
const { get } = MyArticlesStore;
onMounted(() => {
    MyArticlesStore.status = undefined;
    MyArticlesStore.parameters.page = 1;
    get();
})

const sectionRef = ref<HTMLElement>();

watch(() => parameters.value.page, () => {
    get();

    if (sectionRef.value) {
        const headerOffset = 64 + 40; // pt-16 = 4rem = 64px
        const elementPosition = sectionRef.value.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
});

let searchTimeout: NodeJS.Timeout | null = null;
watch(() => search.value, () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
        // prevent double api call, because page is watch
        if (MyArticlesStore.parameters.page == 1) {
            get()
        } else {
            MyArticlesStore.parameters.page = 1;
        }
    }, 2000);
});

const refetch = () => {
    if (MyArticlesStore.parameters.page == 1) get()
    else MyArticlesStore.parameters.page = 1;
}

const filterStatus = computed({
    get: () => (MyArticlesStore.status ?? '') as ContentStatus | '',
    set: (v) => { MyArticlesStore.status = v || undefined; refetch(); }
});
const filterTagSlug = computed({
    get: () => MyArticlesStore.tagSlug ?? '',
    set: (v) => { MyArticlesStore.tagSlug = v || undefined; refetch(); }
});
const filterCategoryId = computed({
    get: () => MyArticlesStore.categoryId ?? '',
    set: (v) => { MyArticlesStore.categoryId = v || undefined; refetch(); }
});


// PREVIEW
const show_preview = ref<boolean>(false)
const selectedPreview = ref<Article | null>(null)

const get_preview = async (id: string) => {
    if (!id) return;
    selectedPreview.value = await Api.get('/v1/article/my/' + id + '?includes=content') as Article

    show_preview.value = true;

}

// SET PUBLISH
const selectedArticleId = ref<string | null>(null);
const showConfirmApprove = ref<boolean>(false);
const showConfirmPublish = ref<boolean>(false);
const showConfirmTakeDown = ref<boolean>(false);
const showConfirmRequestReview = ref<boolean>(false);
</script>

<style></style>
