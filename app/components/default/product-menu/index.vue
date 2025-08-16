<template>
    <!-- only for large screen -->
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="show" @click="$emit('close')"
            class="product-menu max-lg:hidden fixed w-screen h-screen mx-auto top-0 left-0 z-90">
            <div class="w-full max-w-6xl mx-auto pt-16 md:px-24 lg:px-36">
                <div
                    class="rounded-2xl shadow-sm shadow-white/30 border-1 border-[#989898B2] text-white-main overflow-hidden !p-0 bg-[#202020] transform transition-all duration-300 ease-out">
                    <div class="text-xl font-medium px-4 py-2">Product</div>
                    <div class="flex gap-4">
                        <div class="grid grid-cols-2 gap-4 p-4 w-6/10">
                            <template v-for="(menu, n) in menuProduct" :key="n">
                                <DefaultProductMenuList :icon="menu.icon" :to="menu.url" @close="$emit('close')">
                                    <template #title>{{ menu.title }}</template>
                                    <template #desc>{{ menu.desc }}</template>
                                </DefaultProductMenuList>
                            </template>
                        </div>
                        <div class="flex-1 w-full pt-4 pl-4 bg-green-main rounded-tl-xl">
                            <div class="w-full h-full border-1 border-white-main rounded-tl-xl pl-2 pt-2">
                                <div class="w-full h-full bg-no-repeat bg-cover rounded-tl-md"
                                    style="background-image: url('/menu-product.webp');">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
defineEmits(['close'])
defineProps<{
    show: boolean
    menuProduct: any[]
}>()

</script>

<style></style>
