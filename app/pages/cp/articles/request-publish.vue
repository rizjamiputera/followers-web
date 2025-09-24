<template>
    <CpArticleTable subtitle="- Request Publish" />
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.ARTICLE, Permission.PUBLISH)) {
                return navigateTo('/cp')
            }
        }
    ]
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
