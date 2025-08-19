<template>
    <div class="flex flex-col gap-3">
        <div class="flex justify-end gap-1">
            <Button class="">Cancel</Button>
            <Button class="btn-green" @click="save">Save</Button>
        </div>

        <Input v-model="dataDto.title" label="Title" />
        <Input v-model="dataDto.slug" label="Slug" />

        <div>
            <label class="text-sm font-medium">Image</label>
            <LazyImage v-if="image" :src="image" alt="main image" class="w-full max-w-60 aspect-video rounded-xl" />
            <div v-else class="bg-green-main/40 w-full max-w-60 aspect-video rounded-xl"></div>
        </div>

        <Textarea v-model="dataDto.excerpt" label="Ringkasan (max 100 chars)" />

        <!-- Wysiwyg editor -->
        <!-- <div>
            <label class="text-sm font-medium">Content</label>
            <WysiwygEditor v-model="content" />
        </div> -->
        <div>
            <label class="text-sm font-medium">Content</label>
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


const save = () => {
    console.log(content.value)
}
</script>

<style></style>
