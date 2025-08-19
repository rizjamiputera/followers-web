<template>
    <main class="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <Header />
        <div data-theme="light"
            class="drawer-content flex flex-col items-center justify-center bg-white-main min-h-screen">
            <slot />
        </div>
        <div class="drawer-side pt-16 bg-white-main">
            <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <CpDrawerSide />
        </div>
    </main>
</template>

<script lang="ts" setup>
import Header from '~/components/cp/header.vue';


</script>

<style></style>
