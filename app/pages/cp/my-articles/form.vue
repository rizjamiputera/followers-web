<template>
    <div class="flex flex-col gap-3 relative">
        <div class="flex justify-between items-center gap-3">
            <div>
                <div v-if="article" class="badge badge-lg rounded-full"
                    :class="contentStatusBadgeColor(article.status)">
                    {{ article.status.replace('_', ' ') }}
                </div>
            </div>
            <div class="flex flex-wrap gap-1">
                <Button class="max-sm:btn-sm mr-4" @click="show_preview = true">Preview</Button>
                <Button class="max-sm:btn-sm" @click="confirm_cancel = true">Cancel</Button>
                <ClientOnly>
                    <Button class="max-sm:btn-sm btn-green" v-if="canPublish" @click="status = 'PUBLISHED'; validate()">
                        Simpan & Publish
                    </Button>
                    <Button class="max-sm:btn-sm btn-green" v-else @click="status = 'ON_REVIEW'; validate()">
                        Simpan & Ajukan Approval
                    </Button>
                </ClientOnly>
                <Button class="max-sm:btn-sm btn-black" @click="status = 'DRAFT'; validate()">Simpan Draft</Button>
            </div>
        </div>

        <Input v-model="dataDto.title" label="Title" @keyup="checkTitleChange" />
        <div>
            <div class="flex gap-1 items-center mb-2">
                <label class="text-sm font-medium">Slug</label>
                <div v-if="dataDto.slug != article?.slug">
                    <LucideLoader v-if="checkingSlug" :size="24" class="stroke-green-main animate-spin" />
                    <LucideCheckCircle2 v-else-if="slugAvailable" :size="24" class="stroke-green-main" />
                    <LucideXCircle v-else-if="dataDto.title != ''" :size="24" class="stroke-red-800" />
                </div>
            </div>

            <span class="sm:hidden text-sm text-gray-600">{{ webUri }}/read/</span>
            <div class="flex gap-2">
                <div class="join w-full">
                    <button class="max-sm:hidden btn join-item rounded-l-full btn-active font-light">
                        {{ webUri }}/read/
                    </button>
                    <Input class="sm:join-item rounded-full sm:rounded-l-none flex-1" v-model="dataDto.slug"
                        @keyup="checkSlugChange" />
                </div>

                <!-- button link -->
                <template v-if="article ? article.status == 'PUBLISHED' : false">
                    <ButtonLink :to="`${webUri}/read/${dataDto.slug}`" target="_blank" class="btn-outline-green">Open
                    </ButtonLink>
                </template>
            </div>
        </div>

        <div class="w-full flex flex-wrap gap-4 items-stretch">
            <div class="flex-1 max-md:w-full">
                <div>
                    <div class="flex gap-1 items-center mb-1">
                        <label class="text-sm font-medium">Image</label>
                        <ButtonChangePhotos @uploaded="handleNewPhoto" />
                    </div>
                    <LazyImage v-if="dataDto.image" :src="dataDto.image" alt="main image"
                        class="w-full max-w-100 aspect-video bg-cover rounded-xl" />
                    <div v-else class="bg-green-main/40 w-full max-w-60 aspect-video rounded-xl"></div>
                </div>

                <div>
                    <label class="text-sm font-medium">Ringkasan</label>
                    <p class="text-xs font-light mb-1">
                        Berisi maksimal 250 karakter punchline untuk menarik perhatian pembaca
                    </p>
                    <Textarea v-model="dataDto.excerpt" />
                </div>
            </div>

            <div class="max-md:hidden py-3">
                <div class="h-full w-px bg-green-main/10"></div>
            </div>

            <!-- Preview -->
            <div class="max-md:w-full">
                <label class="text-sm font-medium">Preview</label>
                <div class="w-65 flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <!-- image -->
                    <Image v-if="dataDto.image" :src="dataDto.image"
                        class="flex-shrink-0 w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                    <div v-else class="flex-shrink-0 w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20" />
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col gap-2 w-full">
                            <!-- title -->
                            <DefaultBody v-if="dataDto.title" class="line-clamp-1 font-bold">
                                {{ dataDto.title }}
                            </DefaultBody>
                            <div v-else class="h-5 w-3/4 rounded-full bg-green-main/20"></div>
                            <!-- exerpt -->
                            <DefaultBody v-if="dataDto.excerpt" class="line-clamp-3">
                                {{ dataDto.excerpt }}
                            </DefaultBody>
                            <template v-else>
                                <div class="h-3 w-full rounded-full bg-green-main/20 mt-3"></div>
                                <div class="h-3 w-full rounded-full bg-green-main/20"></div>
                                <div class="h-3 w-1/2 rounded-full bg-green-main/20"></div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="dataDto.content?.content">
            <TiptapEditor v-model="dataDto.content.content" />
        </div>

        <div class="flex flex-wrap justify-end gap-1">
            <Button class="max-sm:btn-sm mr-4" @click="show_preview = true">Preview</Button>
            <Button class="max-sm:btn-sm" @click="confirm_cancel = true">Cancel</Button>
            <ClientOnly>
                <Button class="max-sm:btn-sm btn-green" v-if="canPublish" @click="status = 'PUBLISHED'; validate()">
                    Simpan & Publish
                </Button>
                <Button class="max-sm:btn-sm btn-green" v-else @click="status = 'ON_REVIEW'; validate()">
                    Simpan & Ajukan Approval
                </Button>
            </ClientOnly>
            <Button class="max-sm:btn-sm btn-black" @click="status = 'DRAFT'; validate()">Simpan Draft</Button>
        </div>
    </div>

    <LazyModal v-if="confirm_cancel" :show="confirm_cancel" @close="confirm_cancel = false">
        Are you sure to discard?
        <div class="modal-action">
            <Button @click="confirm_cancel = false">Lanjutkan</Button>
            <ButtonLink to="/cp/my-articles" class="btn-green">
                Yes
            </ButtonLink>
        </div>
    </LazyModal>

    <LazyModal v-if="canPublish && showConfirmPublish" :show="showConfirmPublish" @close="showConfirmPublish = false">
        <div class="flex flex-col gap-2">
            <div>Yakin publish artikel ini?</div>
            <div class="text-sm h-[350px]">
                Atur Jadwal:
                <DateTimePicker v-model="publishedAt" />
            </div>
        </div>

        <div class="modal-action">
            <Button @click="showConfirmPublish = false" :disabled="isSubmitting">No</Button>

            <!-- publish -->
            <Button @click="submit" :disabled="isSubmitting" class="btn-green">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Publish
            </Button>
        </div>
    </LazyModal>

    <LazyModal v-if="showConfirmDraftOrReview" :show="showConfirmDraftOrReview"
        @close="showConfirmDraftOrReview = false">
        {{ status == "ON_REVIEW" ? 'Yakin simpan & ajukan approval?' : 'Yakin simpan sebagai draft?' }}
        <div class="modal-action">
            <Button @click="showConfirmDraftOrReview = false" :disabled="isSubmitting">No</Button>

            <Button @click="submit" :disabled="isSubmitting" class="btn-black">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Simpan
            </Button>
        </div>
    </LazyModal>

    <LazyModal v-if="show_preview" :show="show_preview" @close="show_preview = false" max-width="max-w-4xl">
        <div class="p-4">
            <ArticlePreview :data="dataDto" />
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
import Joi from 'joi';
import { LucideCheckCircle2, LucideLoader, LucideXCircle } from 'lucide-vue-next';
import type { Article } from '~/interfaces/article-interface';
import type { ContentStatus, PhotoContent } from '~/interfaces/content-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel'
});

const AuthStore = useAuthStore();
const canPublish = computed(() => AuthStore.can(Module.ARTICLE, Permission.APPROVE));

const { public: { webUri } } = useRuntimeConfig();

const router = useRouter()
const route = useRoute();
let id = route.query.id as string | undefined;

const show_preview = ref<boolean>(false)

const article = ref<Article | undefined>(undefined)
const dataDto = ref<Partial<Article>>({
    content: {
        content: {
            content: [],
            type: 'doc'
        },
    }
});

const newPhotos = ref<PhotoContent[] | null>(null)

const get = async () => {
    if (!id) return;

    article.value = await Api.get('/v1/article/my/' + id + '?includes=content') as Article;

    // initial at edit
    slugAvailable.value = true;
}

onMounted(get);

// Watch for article updates and sync into dataDto
watch(article, (newArticle) => {
    if (newArticle) {
        dataDto.value.title = newArticle.title
        dataDto.value.slug = newArticle.slug
        dataDto.value.excerpt = newArticle.excerpt

        dataDto.value.image = newArticle.image
        dataDto.value.image_md = newArticle.image_md

        dataDto.value.content = { content: newArticle.content!.content };
    }
}, { immediate: true })

const checkTitleChange = () => {
    dataDto.value.slug = slugify(dataDto.value.title ?? '')
    checkSlug();
}
const checkSlugChange = () => {
    dataDto.value.slug = slugify(dataDto.value.slug ?? '')
    checkSlug();
}

// handle photo
const handleNewPhoto = (photos: PhotoContent[]) => {
    newPhotos.value = photos;

    dataDto.value.image = photos[0]?.path ?? '';
    dataDto.value.image_md = photos[1]?.path ?? '';
}

const checkingSlug = ref<boolean>(false);
const slugAvailable = ref<boolean>(false);
let checkSlugTimeout: NodeJS.Timeout | null = null;
const checkSlug = () => {
    if (dataDto.value.slug) {
        checkingSlug.value = true;
        if (checkSlugTimeout) {
            clearTimeout(checkSlugTimeout);
        }

        checkSlugTimeout = setTimeout(async () => {
            try {
                if (article.value) {
                    if (dataDto.value.slug != article.value.slug) {
                        const response = await Api.get('/v1/article/slug/check?slug=' + dataDto.value.slug);
                        slugAvailable.value = response == 'true';
                    }
                } else {
                    const response = await Api.get('/v1/article/slug/check?slug=' + dataDto.value.slug);
                    slugAvailable.value = response == 'true';

                }
            } catch (error) {
                slugAvailable.value = false;
            } finally {
                checkingSlug.value = false;
            }
        }, 2000);
    }
}

// HANDLE SUBMIT
const isCreateArticle = Joi.object({
    title: IsString.max(255),
    slug: IsString.max(255),
    image: IsString,
    image_md: IsString,
    excerpt: IsString.max(250).label('Ringkasan'),
    content: IsContent
})

const isEditArticle = Joi.object({
    title: IsString.max(255),
    slug: IsString.max(255),
    image: IsString.optional().allow(null, ''),
    image_md: IsString.optional().allow(null, ''),
    excerpt: IsString.max(250).label('Ringkasan'),
    content: IsContent
})

const confirm_cancel = ref<boolean>(false);
const showConfirmPublish = ref<boolean>(false);
const showConfirmDraftOrReview = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const validatedData = ref<Record<string, any>>({});

const status = ref<ContentStatus>('DRAFT');
const publishedAt = ref<string | null>(new Date().toISOString())

const validate = () => {
    if (!slugAvailable.value) return;
    // reset
    showConfirmPublish.value = false;
    showConfirmDraftOrReview.value = false;

    try {
        validatedData.value = Validate(id ? isEditArticle : isCreateArticle, dataDto.value);
        validatedData.value.content = validatedData.value.content.content;

        if (status.value == "PUBLISHED") {
            if (article.value) {
                publishedAt.value = article.value.publishedAt ?? '';
            }
            // validatedData.value.status = "PUBLISHED"
            showConfirmPublish.value = true;
        } else {
            // validatedData.value.status = "DRAFT"
            showConfirmDraftOrReview.value = true;
        }
    } catch (error) {
        toastError(error);
    }

}

const submit = async () => {
    if (!slugAvailable.value) return;
    if (isSubmitting.value) return;

    // set loading state
    isSubmitting.value = true;


    try {
        if (id) {
            // update
            await Api.patch('/v1/article/' + id, validatedData.value);

            // 1 set as draft
            if (status.value == "DRAFT" && article.value?.status != "DRAFT") {
                await Api.post('/v1/article/draft/' + id);
            }
            // 2 set as on_review
            if (status.value == "ON_REVIEW" && article.value?.status != "ON_REVIEW") {
                await Api.post('/v1/article/review/' + id);
            }
            // 3 set as publish
            if (status.value == "PUBLISHED" && canPublish.value) {
                await Api.post('/v1/article/publish/' + id, { publishedAt: publishedAt.value });
            }

            get()
        } else {
            // create
            const newData = await Api.post('/v1/article', validatedData.value) as Article;

            if (newData) {
                // 1 set as on_review
                if (status.value == "ON_REVIEW") {
                    await Api.post('/v1/article/review/' + newData.id);
                }
                // 2 set as publish

                if (status.value == "PUBLISHED" && canPublish.value) {
                    // TODO add published at
                    await Api.post('/v1/article/publish/' + newData.id, { publishedAt: publishedAt.value });
                }

                await router.replace({
                    path: '/cp/my-articles/form',
                    query: { id: newData.id }
                })

                id = newData.id;
                get();
            }
        }

        toastSuccess('Success')

        // emit('close');
    } catch (error) {
        toastError(error)
    } finally {
        isSubmitting.value = false;

        showConfirmPublish.value = false;
        showConfirmDraftOrReview.value = false;
    }
}
</script>

<style></style>
