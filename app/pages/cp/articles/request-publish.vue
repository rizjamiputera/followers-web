<template>
    <CpArticleTable subtitle="- Request Publish" />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
});

const ArticlesStore = useArticlesStore()
const { get } = ArticlesStore;
onMounted(() => {
    ArticlesStore.reset();
    ArticlesStore.status = "APPROVED";
    get();
})
</script>

<style></style>
