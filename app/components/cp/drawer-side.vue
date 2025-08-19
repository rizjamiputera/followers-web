<template>
    <ul class="menu bg-base-200 text-base-content min-h-full w-60 p-4">
        <!-- Sidebar content here -->
        <li v-if="can(Module.ARTICLE, Permission.READ)">
            <a>Article</a>
        </li>
        <li v-if="can(Module.ARTICLE, Permission.CREATE)">
            <a>My Article</a>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

const AuthStore = useAuthStore();
const { can } = storeToRefs(AuthStore)

</script>

<style></style>
