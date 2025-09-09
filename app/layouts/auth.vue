<template>
    <div data-theme="light" class="w-screen min-h-screen flex flex-col bg-white-main p-5 sm:p-10">
        <div class="flex-1 grid md:grid-cols-2 py-10">
            <div class="w-full max-w-lg mx-auto flex flex-col gap-4 justify-center ">
                <div class="flex-1 flex flex-col justify-center items-center py-10">
                    <NuxtLink to="/" class="w-1/2 md:w-3/4">
                        <img src="/logo.svg" alt="Logo" class="rounded-full">
                    </NuxtLink>
                </div>
            </div>
            <div class="flex flex-col justify-center bg-green-main/40 p-6 rounded-3xl">
                <div>
                    <slot />
                </div>
            </div>
        </div>
        <!-- FOOTER -->
        <div class="font-light text-sm text-center">
            © {{ new Date().getFullYear() }} Followers Bicara
        </div>
    </div>
</template>

<script lang="ts" setup>
import "vue-toast-notification/dist/theme-sugar.css";

</script>

<style>
@reference "@/assets/css/main.css";
</style>
