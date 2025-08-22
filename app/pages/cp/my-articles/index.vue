<template>
    <div ref="sectionRef" class="flex flex-col gap-4">
        <div class="flex justify-between gap-2 items-center">
            <div class="text-3xl font-medium text-green-main">My Article</div>
            <ButtonLink to="/cp/my-articles/form" class="btn-green">
                Create New Article
            </ButtonLink>
        </div>

        <div class="flex justify-between gap-4">
            <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />

            <div class="flex-1 flex gap-3 justify-end">
                <Input v-model="search" class="input-sm max-w-xs" />
                <select v-model="selectedStatus" @change="updateStatus"
                    class="select w-40 select-sm rounded-full focus:outline-green-main/40 border-green-main/20">
                    <option value="">Semua Status</option>
                    <option v-for="value in articleStatuses" :key="value" :value>{{ value.replace('_', ' ') }}</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-green-main/5 bg-base-100">
            <table class="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Title</th>
                        <th class="text-center">Created At</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Publish</th>
                        <th class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isEmpty">
                        <td colspan="5" class="text-center text-green-main font-light">
                            Empty
                        </td>
                    </tr>
                    <tr v-else-if="!isLoading" v-for="(dt, n) in articles" ::key="dt.id">
                        <td>{{ n + 1 }}</td>
                        <td>
                            <div>
                                <div class="line-clamp-1 text-nowrap">{{ dt.title }}</div>
                                <div class="flex items-center gap-2">
                                    <div class="join join-horizontal">
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-l-full">
                                            <LucideThumbsUp :size="14" /> {{ dt.stats?.likeCount }}
                                        </div>
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-r-full">
                                            <LucideThumbsDown :size="14" /> {{ dt.stats?.dislikeCount }}
                                        </div>
                                    </div>
                                    <div class="join join-horizontal">
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-l-full">
                                            <LucideEye :size="14" /> {{ dt.stats?.readCount }}
                                        </div>
                                        <div class="badge max-sm:badge-sm join-item font-light">
                                            <LucideShare2 :size="14" /> {{ dt.stats?.shareCount }}
                                        </div>
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-r-full">
                                            <LucideBookmark :size="14" /> {{ dt.stats?.bookmarkCount }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="text-center">{{ dayjs(dt.createdAt).format('DD-MMM-YY') }}</td>
                        <td class="text-center">
                            <StatusBade :status="dt.status" />
                        </td>
                        <td class="text-center">
                            <div class="flex gap-1 justify-center">
                                <Button v-if="canWrite && !['PUBLISHED', 'ON_REVIEW'].includes(dt.status)"
                                    class="btn-sm" @click="selectedArticleId = dt.id; showConfirmRequestReview = true">
                                    Ajukan Approval
                                </Button>
                                <Button v-else-if="canPublish && dt.status != 'PUBLISHED'" class="btn-sm"
                                    @click="selectedArticleId = dt.id; showConfirmPublish = true">
                                    Publish
                                </Button>

                                <span v-else-if="dt.status == 'PUBLISHED'">
                                    {{ dt.publishedAt ? formatDateTimeTz(dt.publishedAt) : '-' }}
                                </span>
                                <!-- <ButtonLink :to="`/cp/my-articles/form?id=${dt.id}`" class="btn-sm btn-green">Edit
                                </ButtonLink> -->
                            </div>
                        </td>
                        <td class="text-center">
                            <div class="flex gap-1 justify-center">
                                <Button class="btn-sm" @click="get_preview(dt.id)">Preview</Button>
                                <ButtonLink :to="`/cp/my-articles/form?id=${dt.id}`" class="btn-sm btn-green">Edit
                                </ButtonLink>
                            </div>
                        </td>
                    </tr>
                    <template v-else v-for="n in 10">
                        <tr>
                            <td>
                                <div class="h-6 w-6 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-30 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-20 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-20 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-20 bg-green-main/20 skeleton" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />
    </div>

    <LazyModal v-if="show_preview" :show="show_preview" @close="show_preview = false" max-width="max-w-4xl">
        <div class="p-4" v-if="selectedPreview">
            <ArticlePreview :title="selectedPreview.title" :image="selectedPreview.image"
                :content="selectedPreview.content!.content" />
        </div>
    </LazyModal>

    <LazySetPublishModal v-if="canPublish && selectedArticleId && showConfirmPublish" :show="showConfirmPublish"
        :articleId="selectedArticleId" @close="showConfirmPublish = false"
        @submited="showConfirmPublish = false; get(false)" />

    <LazySetRequestReview v-if="showConfirmRequestReview && selectedArticleId" :show="showConfirmRequestReview"
        :articleId="selectedArticleId" @close="showConfirmRequestReview = false"
        @submited="showConfirmRequestReview = false; get(false)" />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideBookmark, LucideEye, LucideShare2, LucideThumbsDown, LucideThumbsUp } from 'lucide-vue-next';
import { articleStatuses, type Article, type ArticleStatus } from '~/interfaces/article-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel'
});

const AuthStore = useAuthStore();
const canWrite = computed(() => AuthStore.can(Module.ARTICLE, Permission.CREATE));
const canPublish = computed(() => AuthStore.can(Module.ARTICLE, Permission.APPROVE));

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

const selectedStatus = ref<ArticleStatus | ''>('')
const updateStatus = (e: any) => {
    const selected = e.target.value

    MyArticlesStore.status = selected ? selected : undefined;

    // prevent double api call, because page is watch
    if (MyArticlesStore.parameters.page == 1) {
        get()
    } else {
        MyArticlesStore.parameters.page = 1;
    }
}


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
const showConfirmPublish = ref<boolean>(false);
const showConfirmRequestReview = ref<boolean>(false);
</script>

<style></style>
