<template>
    <CpArticleTable />
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.ARTICLE, Permission.READ)) {
                return navigateTo('/cp')
            }
        }
    ]
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
