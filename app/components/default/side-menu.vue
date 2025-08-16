<template>
    <aside :class="show ? 'md:translate-x-0' : 'translate-x-full'"
        class="fixed top-0 right-0 h-screen w-lg max-w-screen overflow-hidden bg-default/90 backdrop-blur-md text-base-content transition duration-500 ease-out z-[9999] flex flex-col gap-4 p-4">
        <div class="w-full flex items-center justify-between">
            <NuxtLink to="/" prefetch-on="interaction">
                <img src="/logo-putih.webp" alt="Followers Logo" class="h-6">
            </NuxtLink>
            <div class="flex gap-5 items-center">
                <ButtonLink to="/login" prefetch-on="interaction" @click="$emit('close')" class="font-medium h-9">
                    Login
                </ButtonLink>
                <button @click="$emit('close')"
                    class="btn bg-default border-1 border-white h-9 p-3 rounded-xl shadow-none">
                    <svg-menu-close class="w-3" />
                </button>
            </div>
        </div>
        <div class="side-menu menu flex-1 max-h-full w-full overflow-y-auto border-1 border-white-main rounded-2xl p-4">
            <ul>
                <li>
                    <NuxtLink to="/" prefetch-on="interaction" class="text-nowrap text-white-main"
                        @click="$emit('close')">Home</NuxtLink>
                </li>
                <!-- <li>
                    <details :open="isOpen">
                        <summary class="text-white-main">Product</summary>
                        <div class="pl-12 p-3 flex flex-col gap-4">
                            <template v-for="(menu, n) in menuProduct" :key="n">
                                <DefaultProductMenuList :icon="menu.icon" :to="menu.url" @close="$emit('close')">
                                    <template #title>{{ menu.title }}</template>
<template #desc>{{ menu.desc }}</template>
</DefaultProductMenuList>
</template>
</div>
</details>
</li> -->
                <li>
                    <NuxtLink to="#" prefetch-on="interaction" class="text-nowrap text-white-main"
                        @click="$emit('close')">About us
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script lang="ts" setup>
defineEmits(['close'])
const props = defineProps<{
    show: boolean
    menuProduct: any[]
}>()

const route = useRoute();

const isOpen = computed(() => props.menuProduct.some(m => route.path.startsWith(m.url)))
</script>

<style></style>
