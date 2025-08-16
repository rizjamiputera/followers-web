<template>
    <header class="fixed z-50 navbar bg-white/80 backdrop-blur-sm shadow-sm w-screen">
        <div class="w-full max-w-6xl mx-auto relative">
            <DefaultProductMenu :show="show_product_menu" :menuProduct @close="show_product_menu = false" />


            <div class="flex justify-between px-2 md:px-12">
                <div class="navbar-start">
                    <NuxtLink to="/" prefetch-on="interaction">
                        <img src="/logo-hitam.webp" alt="Followers Logo" class="h-10">
                    </NuxtLink>
                </div>
                <div class="navbar-center hidden lg:flex">
                    <!-- MENU -->
                    <ul class="menu menu-horizontal px-1">
                        <!-- MENU ITEM -->
                        <li>
                            <NuxtLink to="/" prefetch-on="interaction"
                                class="text-nowrapp hover:text-green-main hover:bg-green-50/10 transition-all duration-200 rounded-lg">
                                Home
                            </NuxtLink>
                        </li>
                        <!-- <li>
                            <button @click="show_product_menu = !show_product_menu"
                                class="text-nowrap hover:text-green-main hover:bg-green-50/10 transition-all duration-200 rounded-lg">
                                Product
                                <SvgChevronDown :class="show_product_menu ? 'rotate-180' : ''"
                                    class="w-2 transition-transform duration-300 hover:stroke-green-main" />
                            </button>
                        </li> -->
                        <li>
                            <NuxtLink to="#" prefetch-on="interaction"
                                class="text-nowrap hover:text-green-main hover:bg-green-50/10 transition-all duration-200 rounded-lg">
                                About us
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="navbar-end gap-5">
                    <ButtonLink to="/" prefetch-on="interaction" class="btn-white font-medium h-9">
                        Login
                    </ButtonLink>
                    <button @click="$emit('open')"
                        class="lg:hidden btn bg-green-main border-1 border-white h-9 p-3 rounded-xl shadow-none">
                        <svg-menu-bar class="w-3" />
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
const emits = defineEmits(['open'])
defineProps<{
    menuProduct: any[]
}>()

const show_product_menu = ref<boolean>(false);


const checkScreenSize = () => {
    if (typeof window !== 'undefined') {
        if (window.innerWidth < 1024) {
            show_product_menu.value = false;
        }
    }
}

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
    }
});
</script>
