<template>
    <CpArticleTable />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
});

const ArticlesStore = useArticlesStore()
const { get } = ArticlesStore;
onMounted(() => {
    ArticlesStore.reset();
    ArticlesStore.parameters.page = 1;
    get();
})
</script>

<style></style>
