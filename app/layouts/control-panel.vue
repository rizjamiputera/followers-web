<template>
    <ClientOnly>
        <main class="drawer lg:drawer-open overflow-x-clip cp-shell">
            <input id="my-drawer" type="checkbox" class="drawer-toggle" />
            <Header />
            <div data-theme="light" class="drawer-content min-h-screen bg-white-main pt-16 relative">
                <div class="p-5 sm:p-10 relative">
                    <slot />
                </div>
            </div>
            <div class="drawer-side">
                <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                <div class="h-full pt-16">
                    <CpMenu />
                </div>
            </div>
        </main>
    </ClientOnly>
</template>

<script lang="ts" setup>
import Header from '~/components/cp/header.vue';
import "vue-toast-notification/dist/theme-sugar.css";
</script>

<style>
/* Warm-paper CP shell: cream content on a soft warm-white sidebar. */
.cp-shell .drawer-content { background: #f5f3ec; }
.cp-shell .drawer-side .menu { background: #fbfaf4; border-right: 1px solid rgba(0, 116, 38, .08); }
</style>
