<template>
    <div class="flex flex-col gap-3 relative">
        <div class="flex justify-between items-center gap-3">
            <div>
                <div v-if="article" class="badge badge-lg rounded-full"
                    :class="articleStatusBadgeColor(article.status)">
                    {{ article.status.replace('_', ' ') }}
                </div>
            </div>
            <div class="flex gap-1">
                <Button class="mr-4" @click="show_preview = true">Preview</Button>
                <Button @click="confirm_cancel = true">Cancel</Button>
                <ClientOnly>
                    <Button class="btn-green" v-if="canPublish" @click="status = 'PUBLISHED'; validate()">
                        Simpan & Publish
                    </Button>
                    <Button class="btn-green" v-else @click="status = 'ON_REVIEW'; validate()">
                        Simpan & Ajukan Approval
                    </Button>
                </ClientOnly>
                <Button class="btn-black" @click="status = 'DRAFT'; validate()">Simpan Draft</Button>
            </div>
        </div>

        <Input v-model="title" label="Title" @keyup="checkTitleChange" />
        <div>
            <div class="flex gap-1 items-center mb-2">
                <label class="text-sm font-medium">Slug</label>
                <div v-if="slug != article?.slug">
                    <LucideLoader v-if="checkingSlug" :size="24" class="stroke-green-main animate-spin" />
                    <LucideCheckCircle2 v-else-if="slugAvailable" :size="24" class="stroke-green-main" />
                    <LucideXCircle v-else-if="title != ''" :size="24" class="stroke-red-800" />
                </div>
            </div>

            <div class="join w-full">
                <button class="btn join-item rounded-l-full btn-active font-light">{{ webUri }}/read/</button>
                <Input class="join-item rounded-l-none flex-1" v-model="slug" @keyup="checkSlugChange" />
            </div>
        </div>

        <div class="w-full flex flex-wrap gap-4 items-stretch">
            <div class="flex-1 max-md:w-full">
                <div>
                    <div class="flex gap-1 items-center mb-1">
                        <label class="text-sm font-medium">Image</label>
                        <ButtonChangePhotos @uploaded="handleNewPhoto" />
                    </div>
                    <LazyImage v-if="image" :src="image" alt="main image"
                        class="w-full max-w-100 aspect-video bg-cover rounded-xl" />
                    <div v-else class="bg-green-main/40 w-full max-w-60 aspect-video rounded-xl"></div>
                </div>

                <div>
                    <label class="text-sm font-medium">Ringkasan</label>
                    <p class="text-xs font-light mb-1">
                        Berisi maksimal 100 karakter punchline untuk menarik perhatian pembaca
                    </p>
                    <Textarea v-model="excerpt" />
                </div>
            </div>

            <div class="max-md:hidden py-3">
                <div class="h-full w-px bg-green-main/10"></div>
            </div>

            <!-- Preview -->
            <div class="max-md:w-full">
                <label class="text-sm font-medium">Preview</label>
                <div class="w-full min-w-65 flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <!-- image -->
                    <Image v-if="image" :src="image"
                        class="flex-shrink-0 w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                    <div v-else class="flex-shrink-0 w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20" />
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col gap-2 w-full">
                            <!-- title -->
                            <DefaultBody v-if="title" class="line-clamp-1 font-bold">
                                {{ title }}
                            </DefaultBody>
                            <div v-else class="h-5 w-3/4 rounded-full bg-green-main/20"></div>
                            <!-- exerpt -->
                            <DefaultBody v-if="excerpt" class="line-clamp-3">
                                {{ excerpt }}
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

        <div>
            <TiptapEditor v-model="content" />
        </div>

        <div class="flex justify-end gap-1">
            <Button class="mr-4" @click="show_preview = true">Preview</Button>
            <Button @click="confirm_cancel = true">Cancel</Button>
            <ClientOnly>
                <Button class="btn-green" v-if="canPublish" @click="status = 'PUBLISHED'; validate()">
                    Simpan & Publish
                </Button>
                <Button class="btn-green" v-else @click="status = 'ON_REVIEW'; validate()">
                    Simpan & Ajukan Approval
                </Button>
            </ClientOnly>
            <Button class="btn-black" @click="status = 'DRAFT'; validate()">Simpan Draft</Button>
        </div>
    </div>

    <ClientOnly>
        <LazyModal v-if="confirm_cancel" :show="confirm_cancel" @close="confirm_cancel = false">
            Are you sure to discard?
            <div class="modal-action">
                <Button @click="confirm_cancel = false">Lanjutkan</Button>
                <ButtonLink to="/cp/my-articles" class="btn-green">
                    Yes
                </ButtonLink>
            </div>
        </LazyModal>

        <LazyModal v-if="canPublish && showConfirmPublish" :show="showConfirmPublish"
            @close="showConfirmPublish = false">
            Yakin simpan publish artikel ini?
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
            Yakin simpan sebagai draft?
            <div class="modal-action">
                <Button @click="showConfirmDraftOrReview = false" :disabled="isSubmitting">No</Button>

                <Button @click="submit" :disabled="isSubmitting" class="btn-black">
                    <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                    Simpan Draft
                </Button>
            </div>
        </LazyModal>

        <LazyModal v-if="show_preview" :show="show_preview" @close="show_preview = false" max-width="max-w-4xl">
            <div class="p-4">
                <ArticlePreview :title :image :content />
            </div>
        </LazyModal>
    </ClientOnly>
</template>

<script lang="ts" setup>
import Joi from 'joi';
import { LucideCheckCircle2, LucideLoader, LucideXCircle } from 'lucide-vue-next';
import { type Article, type ArticleStatus, type PhotoContent } from '~/interfaces/article-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel'
});
const AuthStore = useAuthStore();
const { can } = storeToRefs(AuthStore)

const canPublish = computed(() => AuthStore.can(Module.ARTICLE, Permission.APPROVE));

const { public: { webUri } } = useRuntimeConfig();
const route = useRoute();
const id = route.query.id as string | undefined;

const show_preview = ref<boolean>(false)

const article = ref<Article | undefined>(undefined)
const title = ref<string>('')
const slug = ref<string>('')
const excerpt = ref<string>('')
const content = ref<any>("")

const image = ref<string | null>(null)
const newPhotos = ref<PhotoContent[] | null>(null)

const get = async () => {
    if (!id) return;
    // const id = route.params.id as string;

    article.value = await Api.get('/v1/article/my/' + id + '?includes=content') as Article;

    // initial at edit
    slugAvailable.value = true;
}

onMounted(get);

// Watch for article updates and sync into dataDto
watch(article, (newArticle) => {
    if (newArticle) {
        title.value = newArticle.title
        slug.value = newArticle.slug
        excerpt.value = newArticle.excerpt

        image.value = newArticle.image
        content.value = newArticle.content?.content || null
    }
}, { immediate: true })



const checkTitleChange = () => {
    slug.value = slugify(title.value)
    checkSlug();
}
const checkSlugChange = () => {
    slug.value = slugify(slug.value)
    checkSlug();
}

// handle photo
const handleNewPhoto = (photos: PhotoContent[]) => {
    newPhotos.value = photos;

    image.value = photos[0]?.path ?? '';
}

const checkingSlug = ref<boolean>(false);
const slugAvailable = ref<boolean>(false);
let checkSlugTimeout: NodeJS.Timeout | null = null;
const checkSlug = () => {
    if (slug.value) {
        checkingSlug.value = true;
        if (checkSlugTimeout) {
            clearTimeout(checkSlugTimeout);
        }

        checkSlugTimeout = setTimeout(async () => {
            try {
                if (article.value) {
                    if (slug.value != article.value.slug)
                        slugAvailable.value = await Api.get('/v1/article/slug/check?slug=' + slug.value) as boolean;
                } else {
                    slugAvailable.value = await Api.get('/v1/article/slug/check?slug=' + slug.value) as boolean;

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
    title: IsString,
    slug: IsString,
    image: IsString,
    image_md: IsString,
    excerpt: IsString.label('Ringkasan'),
    content: Joi.object(),
})
const isEditArticle = Joi.object({
    title: IsString,
    slug: IsString,
    image: IsString.optional().allow(null, ''),
    image_md: IsString.optional().allow(null, ''),
    excerpt: IsString.label('Ringkasan'),
    content: Joi.object(),
})

const confirm_cancel = ref<boolean>(false);
const showConfirmPublish = ref<boolean>(false);
const showConfirmDraftOrReview = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const validatedData = ref<Record<string, any>>({});

const status = ref<ArticleStatus>('DRAFT');

const validate = () => {
    // reset
    showConfirmPublish.value = false;
    showConfirmDraftOrReview.value = false;

    const dataDto: Partial<Article> = {
        title: title.value,
        slug: slug.value,
        excerpt: excerpt.value,
        ...((newPhotos.value && newPhotos.value.length == 2) && {
            image: newPhotos.value[0]?.path,
            image_md: newPhotos.value[1]?.path,
        }),
        content: content.value
    };

    try {
        validatedData.value = Validate(id ? isEditArticle : isCreateArticle, dataDto);

        if (status.value == "PUBLISHED") {
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
    // if (!article.value) return;
    if (!slugAvailable.value) return;
    if (isSubmitting.value) return;

    // set loading state
    isSubmitting.value = true;


    try {
        // const data = Validate(isArticle, dataDto);

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
            if (status.value == "PUBLISHED" && article.value?.status != "PUBLISHED" && canPublish.value) {
                // TODO add published at
                await Api.post('/v1/article/publish/' + id);
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
                    await Api.post('/v1/article/publish/' + newData.id);
                }

                navigateTo('/cp/my-articles/form?id=' + newData.id);
            }
        }

        // showConfirm.value = false;
        toastSuccess('Success')

        // emit('close');
    } catch (error) {
        console.log(error)
        toastError(error)
    } finally {
        isSubmitting.value = false;

        showConfirmPublish.value = false;
        showConfirmDraftOrReview.value = false;
    }
}
</script>

<style></style>
