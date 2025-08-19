<template>
    <ul class="menu bg-base-200 text-base-content min-h-full w-60 p-4">
        <!-- Sidebar content here -->
        <li v-if="can(Module.ARTICLE, Permission.READ)">
            <NuxtLink to="/cp/articles" prefetch-on="interaction">Article</NuxtLink>
        </li>
        <li v-if="can(Module.ARTICLE, Permission.CREATE)">
            <NuxtLink to="/cp/my-articles" prefetch-on="interaction">My Article</NuxtLink>
        </li>
        <!-- <li v-if="can(Module.ARTICLE, Permission.CREATE)">
            <details open>
                <summary>My Article</summary>
                <ul>
                    <li>
                        <NuxtLink to="/cp/my-articles" prefetch-on="interaction">Semua</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/cp/my-articles/published" prefetch-on="interaction">Published</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/cp/my-articles/draft" prefetch-on="interaction">Draft</NuxtLink>
                    </li>
                </ul>
            </details>
        </li> -->
    </ul>
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

const AuthStore = useAuthStore();
const { can } = storeToRefs(AuthStore)

</script>

<style></style>
