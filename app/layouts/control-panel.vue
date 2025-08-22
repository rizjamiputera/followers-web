<template>
    <main class="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <Header />
        <div data-theme="light" class="drawer-content min-h-screen bg-white-main pt-16 relative">
            <div class="p-5 sm:p-10 relative">
                <slot />
            </div>
        </div>
        <div class="drawer-side pt-16">
            <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <CpDrawerSide />
        </div>
    </main>
</template>

<script lang="ts" setup>
import Header from '~/components/cp/header.vue';
import "vue-toast-notification/dist/theme-sugar.css";

</script>

<style></style>
