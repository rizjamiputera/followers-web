<template>
    <CpArticleTable subtitle="- Request Approval" />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
});

const ArticlesStore = useArticlesStore()
const { get } = ArticlesStore;
onMounted(() => {
    ArticlesStore.reset();
    ArticlesStore.status = "ON_REVIEW";
    get();
})
</script>

<style></style>
