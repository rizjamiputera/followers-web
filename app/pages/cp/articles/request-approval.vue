<template>
    <CpArticleTable subtitle="- Request Approval" />
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.ARTICLE, Permission.APPROVE)) {
                return navigateTo('/cp')
            }
        }
    ]
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
