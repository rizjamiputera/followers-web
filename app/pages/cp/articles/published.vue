<template>
    <CpArticleTable subtitle="Publised" />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
});

const ArticlesStore = useArticlesStore()
const { get } = ArticlesStore;
onMounted(() => {
    ArticlesStore.reset();
    ArticlesStore.status = "PUBLISHED";
    get();
})
</script>

<style></style>
