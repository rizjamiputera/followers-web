<template>
    <div class="flex-1 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:justify-end">
        <Input v-if="!hideSearch" v-model="search" :placeholder="searchPlaceholder"
            class="input-sm w-full sm:max-w-xs" />

        <!-- Mobile: 2-col grid of selects. Desktop: display:contents lets them
             flow directly into the parent's right-aligned wrapping row. -->
        <div class="grid grid-cols-2 gap-3 sm:contents">
            <select v-model="categoryId"
                class="select select-sm w-full sm:w-40 rounded-full focus:outline-green-main/40 border-green-main/20">
                <option value="">Semua Kategori</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">
                    {{ c.name }}
                </option>
            </select>

            <select v-model="tagSlug"
                class="select select-sm w-full sm:w-40 rounded-full focus:outline-green-main/40 border-green-main/20">
                <option value="">Semua Tag</option>
                <option v-for="t in tags" :key="t.id" :value="t.slug">
                    {{ t.name }}
                </option>
            </select>

            <select v-if="!hideStatus" v-model="status"
                class="select select-sm w-full sm:w-40 rounded-full focus:outline-green-main/40 border-green-main/20">
                <option value="">Semua Status</option>
                <option v-for="value in contentStatuses" :key="value" :value="value">
                    {{ value.replace('_', ' ') }}
                </option>
            </select>

            <select v-if="showSort" v-model="sort"
                class="select select-sm w-full sm:w-48 rounded-full focus:outline-green-main/40 border-green-main/20">
                <option v-for="opt in CONTENT_SORT_OPTIONS" :key="opt.key" :value="opt.key">
                    {{ opt.label }}
                </option>
            </select>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { contentStatuses, type ContentStatus } from '~/interfaces/content-interface';

const search = defineModel<string>('search', { default: '' });
const status = defineModel<ContentStatus | ''>('status', { default: '' });
const tagSlug = defineModel<string>('tagSlug', { default: '' });
const categoryId = defineModel<string>('categoryId', { default: '' });
const sort = defineModel<string>('sort', { default: 'newest' });

defineProps<{
    hideStatus?: boolean
    hideSearch?: boolean
    showSort?: boolean
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
