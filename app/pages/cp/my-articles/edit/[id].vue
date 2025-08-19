<template>
    <div class="flex flex-col gap-3 relative">
        <div class="flex justify-end gap-1">
            <Button class="">Cancel</Button>
            <Button class="btn-green" @click="save">Save</Button>
        </div>

        <Input v-model="dataDto.title" label="Title" />
        <Input v-model="dataDto.slug" label="Slug" />

        <!-- <div class="w-full flex flex-wrap divide-x-1  divide-green-main/20 "> -->
        <div class="w-full flex flex-wrap gap-4 items-stretch">
            <div class="flex-1 max-md:w-full">
                <div>
                    <label class="text-sm font-medium">Image</label>
                    <LazyImage v-if="image" :src="image" alt="main image"
                        class="w-full max-w-100 aspect-video bg-cover rounded-xl" />
                    <div v-else class="bg-green-main/40 w-full max-w-60 aspect-video rounded-xl"></div>
                </div>

                <div>
                    <label class="text-sm font-medium">Ringkasan</label>
                    <p class="text-xs font-light mb-1">Berisi maksimal 100 karakter punchline untuk menarik perhatian
                        pembaca
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
                <div class="w-full sm:max-w-65 flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <!-- image -->
                    <Image v-if="image" :src="image"
                        class="flex-shrink-0 w-30 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
                    <div v-else
                        class="flex-shrink-0 w-30 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-green-main/20 skeleton" />
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col gap-2 w-full">
                            <!-- title -->
                            <DefaultBody v-if="dataDto.title" class="line-clamp-1 font-bold">
                                {{ dataDto.title }}
                            </DefaultBody>
                            <div v-else class="h-5 w-3/4 bg-green-main/20 skeleton"></div>
                            <!-- exerpt -->
                            <DefaultBody v-if="dataDto.excerpt" class="line-clamp-3">
                                {{ dataDto.excerpt }}
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
            <Button class="">Cancel</Button>
            <Button class="btn-green" @click="save">Save</Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Article } from '~/interfaces/article-interface';

definePageMeta({
    layout: 'control-panel'
})
const route = useRoute();

const article = ref<Article | undefined>(undefined)
const content = ref<any>(undefined)

const dataDto = ref({
    title: '',
    slug: '',
    excerpt: '',
});

const image = ref<string | null>(null)

const get = async () => {
    const id = route.params.id as string;

    article.value = await Api.get('/v1/article/' + id + '?includes=content&format=html',) as Article
    console.log(article.value)
}

onMounted(get);

// Watch for article updates and sync into dataDto
watch(article, (newArticle) => {
    if (newArticle) {
        dataDto.value.title = newArticle.title
        dataDto.value.slug = newArticle.slug
        dataDto.value.excerpt = newArticle.excerpt

        image.value = newArticle.image_sm
        content.value = newArticle.content?.content || null
    }
}, { immediate: true })
watch(dataDto.value, (newDto) => {
    if (newDto) {
        dataDto.value.slug = newDto.title.toLowerCase().replaceAll(' ', '-')
    }
}, { immediate: true })


const save = () => {
    console.log(content.value)
}
</script>

<style></style>
