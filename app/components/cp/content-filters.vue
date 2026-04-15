<template>
    <div class="flex-1 flex gap-3 justify-end flex-wrap">
        <Input v-model="search" :placeholder="searchPlaceholder" class="input-sm max-w-xs" />

        <select v-model="categoryId"
            class="select w-40 select-sm rounded-full focus:outline-green-main/40 border-green-main/20">
            <option value="">Semua Kategori</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
            </option>
        </select>

        <select v-model="tagSlug"
            class="select w-40 select-sm rounded-full focus:outline-green-main/40 border-green-main/20">
            <option value="">Semua Tag</option>
            <option v-for="t in tags" :key="t.id" :value="t.slug">
                {{ t.name }}
            </option>
        </select>

        <select v-if="!hideStatus" v-model="status"
            class="select w-40 select-sm rounded-full focus:outline-green-main/40 border-green-main/20">
            <option value="">Semua Status</option>
            <option v-for="value in contentStatuses" :key="value" :value="value">
                {{ value.replace('_', ' ') }}
            </option>
        </select>
    </div>
</template>

<script lang="ts" setup>
import { contentStatuses, type ContentStatus } from '~/interfaces/content-interface';

const search = defineModel<string>('search', { default: '' });
const status = defineModel<ContentStatus | ''>('status', { default: '' });
const tagSlug = defineModel<string>('tagSlug', { default: '' });
const categoryId = defineModel<string>('categoryId', { default: '' });

defineProps<{
    hideStatus?: boolean
    searchPlaceholder?: string
}>();

const TagsStore = useTagsStore();
const CategoriesStore = useCategoriesStore();
const { tags } = storeToRefs(TagsStore);
const { categories } = storeToRefs(CategoriesStore);

onMounted(() => {
    if (!tags.value.length) TagsStore.get();
    if (!categories.value.length) CategoriesStore.fetch();
});
</script>
