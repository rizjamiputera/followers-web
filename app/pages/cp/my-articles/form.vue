<template>
    <div class="flex flex-col gap-3 relative">
        <div class="flex justify-between items-center gap-3">
            <div v-if="article" class="badge badge-lg rounded-full" :class="articleStatusBadgeColor(article.status)">
                {{ article.status.replace('_', ' ') }}
            </div>
            <div class="flex gap-1">
                <Button class="mr-4" @click="show_preview = true">Preview</Button>
                <Button @click="confirm_cancel = true">Cancel</Button>
                <Button class="btn-green" @click="showConfirm = true">Save</Button>
            </div>
        </div>

        <Input v-model="title" label="Title" @keyup="checkTitleChange" />
        <div>
            <div class="flex gap-1 items-center mb-2">
                <label class="text-sm font-medium">Slug</label>
                <div v-if="slug != article?.slug">
                    <LucideLoader v-if="checkingSlug" :size="24" class="stroke-green-main animate-spin" />
                    <LucideCheckCircle2 v-else-if="slugAvailable" :size="24" class="stroke-green-main" />
                    <LucideXCircle v-else :size="24" class="stroke-red-800" />
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
                <div class="w-full sm:max-w-65 flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <!-- image -->
                    <Image v-if="image" :src="image"
                        class="flex-shrink-0 w-30 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                    <div v-else
                        class="flex-shrink-0 w-30 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20 skeleton" />
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col gap-2 w-full">
                            <!-- title -->
                            <DefaultBody v-if="title" class="line-clamp-1 font-bold">
                                {{ title }}
                            </DefaultBody>
                            <div v-else class="h-5 w-3/4 bg-green-main/20 skeleton"></div>
                            <!-- exerpt -->
                            <DefaultBody v-if="excerpt" class="line-clamp-3">
                                {{ excerpt }}
                            </DefaultBody>
                            <template v-else>
                                <div class="h-3 w-full bg-green-main/20 skeleton mt-3"></div>
                                <div class="h-3 w-full bg-green-main/20 skeleton"></div>
                                <div class="h-3 w-1/2 bg-green-main/20 skeleton"></div>
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
            <Button class="btn-green" @click="showConfirm = true">Save</Button>
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
        <LazyModal v-if="showConfirm" :show="showConfirm" @close="showConfirm = false">
            Are you sure?
            <div class="modal-action">
                <Button @click="showConfirm = false" :disabled="isSubmitting">No</Button>
                <Button @click="submit" :disabled="isSubmitting" class="btn-green">
                    <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                    Simpan
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
import type { Article, PhotoContent } from '~/interfaces/article-interface';

definePageMeta({
    layout: 'control-panel'
});

const { public: { webUri } } = useRuntimeConfig();
const route = useRoute();
const id = route.query.id as string | undefined;

const show_preview = ref<boolean>(false)

const article = ref<Article | undefined>(undefined)
const title = ref<string>('')
const slug = ref<string>('')
const excerpt = ref<string>('')
const content = ref<any>(undefined)

const image = ref<string | null>(null)
const newPhotos = ref<PhotoContent[] | null>(null)

const get = async () => {
    if (!id) return;
    // const id = route.params.id as string;

    article.value = await Api.get('/v1/article/my/' + id + '?includes=content') as Article
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
const slugAvailable = ref<boolean>(true);
let checkSlugTimeout: NodeJS.Timeout | null = null;
const checkSlug = () => {
    if (slug.value && article.value) {

        if (slug.value != article.value.slug) {
            checkingSlug.value = true;
            if (checkSlugTimeout) {
                clearTimeout(checkSlugTimeout);
            }

            checkSlugTimeout = setTimeout(async () => {
                try {
                    slugAvailable.value = await Api.get('/v1/article/slug/check?slug=' + slug.value) as boolean;
                } catch (error) {
                    slugAvailable.value = false;
                } finally {
                    checkingSlug.value = false;
                }
            }, 2000);
        }

    }
}


// HANDLE SUBMIT
const isArticle = Joi.object({
    title: IsString,
    slug: IsString,
    excerpt: IsString,
    image: IsString.optional().allow(null, ''),
    image_md: IsString.optional().allow(null, ''),
})

const confirm_cancel = ref<boolean>(false);
const showConfirm = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const submit = async () => {
    if (!article.value) return;
    if (!slugAvailable.value) return;
    if (isSubmitting.value) return;

    // set loading state
    isSubmitting.value = true;

    const dataDto: Partial<Article> = {
        title: title.value,
        slug: slug.value,
        excerpt: excerpt.value,
        ...((newPhotos.value && newPhotos.value.length == 2) && {
            image: newPhotos.value[0]?.path,
            image_md: newPhotos.value[1]?.path,
        })
    };

    try {
        const data = Validate(isArticle, dataDto);

        await Api.patch('/v1/article/' + article.value.id, {
            ...data,
            content: content.value,
        });

        showConfirm.value = false;
        toastSuccess('Success')

        // emit('close');
    } catch (error) {
        toastError(error)
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style></style>
