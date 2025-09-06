<template>
    <header class="fixed z-50 navbar bg-[rgba(244, 242, 238, 1)]/20 backdrop-blur-sm shadow-sm w-screen">
        <div class="w-full max-w-6xl mx-auto relative">
            <!-- <DefaultProductMenu :show="show_product_menu" :menuProduct @close="show_product_menu = false" /> -->


            <div class="flex justify-between px-2 md:px-12">
                <div class="navbar-start">
                    <NuxtLink to="/" prefetch-on="interaction">
                        <!-- <img src="/logo-hitam.webp" alt="Followers Logo" class="h-10"> -->
                        <img src="/logo.svg" alt="Followers Logo" class="h-10">
                    </NuxtLink>
                </div>
                <div class="navbar-center hidden lg:flex">
                    <!-- MENU -->
                    <ul ref="menuRef" class="menu menu-horizontal px-1 relative">
                        <div class="sliding-bg"></div>
                        <!-- MENU ITEM -->
                        <li>
                            <NuxtLink to="/" prefetch-on="interaction"
                                class="text-nowrapp hover:text-green-main hover:bg-green-50/10 transition-all duration-200 rounded-lg">
                                Home
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/kegiatan" prefetch-on="interaction"
                                class="text-nowrapp hover:text-green-main hover:bg-green-50/10 transition-all duration-200 rounded-lg">
                                Kegiatan
                            </NuxtLink>
                        </li>
                        <template v-if="false">
                            <li>
                                <button @click="show_product_menu = !show_product_menu"
                                    class="text-nowrap hover:text-green-main hover:bg-green-50/10 transition-all duration-200 rounded-lg">
                                    Product
                                    <SvgChevronDown :class="show_product_menu ? 'rotate-180' : ''"
                                        class="w-2 transition-transform duration-300 hover:stroke-green-main" />
                                </button>
                            </li>
                            <li>
                                <NuxtLink to="#" prefetch-on="interaction"
                                    class="text-nowrap hover:text-green-main hover:bg-green-50/10 transition-all duration-200 rounded-lg">
                                    About us
                                </NuxtLink>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="navbar-end gap-5">
                    <ClientOnly>
                        <LazyButtonLink v-if="!user" to="/auth/login" prefetch-on="interaction"
                            class="btn-sm btn-success text-success bg-success/10 font-medium h-9">
                            <div>Daftar | Login</div>
                            <SvgUser class="w-3" />
                        </LazyButtonLink>
                        <div v-else class="dropdown dropdown-bottom dropdown-left">
                            <div tabindex="0" role="button"
                                class="btn btn-lg btn-active btn-circle bg-indigo-300 border-0">
                                <Avatar :avatar="user.avatar_md" :name="user.name" class="w-full h-full" />
                            </div>
                            <div tabindex="0"
                                class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <div class="p-2 flex flex-col gap-1">
                                    <div class="font-cinzel tracking-wide text-green-main font-medium">{{ user.name }}
                                    </div>
                                    <div class="text-xs">Member since {{ dayjs(user.createdAt).format('DD MMM YYYY') }}
                                    </div>
                                </div>
                                <hr>
                                <ul class="mt-1 flex flex-col gap-1 text-sm">
                                    <li>
                                        <NuxtLink to="/profile" class="rounded-full">
                                            Profile
                                        </NuxtLink>
                                    </li>
                                    <li v-if="user.role != 'USER'">
                                        <NuxtLink to="/cp" class="rounded-full justify-between">
                                            Go to admin
                                            <LucideArrowRight :size="12" />
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <a @click="handleLogout" class="bg-error text-white-main rounded-full btn-xs">
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </ClientOnly>
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
import dayjs from 'dayjs';
import { LucideArrowRight } from 'lucide-vue-next';

const emits = defineEmits(['open'])
defineProps<{
    menuProduct: any[]
}>()

const AuthStore = useAuthStore();

const { user } = storeToRefs(AuthStore);
const { handleLogout } = AuthStore;

const show_product_menu = ref<boolean>(false);
const menuRef = ref<HTMLElement>();

const updateSlidingBackground = () => {
    if (!menuRef.value) return;

    const activeLink = menuRef.value.querySelector('.router-link-active');
    const slidingBg = menuRef.value.querySelector('.sliding-bg') as HTMLElement;

    if (!slidingBg) return;

    if (activeLink) {
        const parentLi = activeLink.closest('li') as HTMLElement;
        if (parentLi) {
            const rect = parentLi.getBoundingClientRect();
            const menuRect = menuRef.value.getBoundingClientRect();

            slidingBg.style.left = `${parentLi.offsetLeft}px`;
            slidingBg.style.width = `${parentLi.offsetWidth}px`;
            slidingBg.classList.add('active');
        }
    } else {
        slidingBg.classList.remove('active');
    }
};

onMounted(() => {
    nextTick(() => {
        updateSlidingBackground();
    });
});

// Watch for route changes
watch(() => useRoute().path, () => {
    nextTick(() => {
        updateSlidingBackground();
    });
});

// const checkScreenSize = () => {
//     if (typeof window !== 'undefined') {
//         if (window.innerWidth < 1024) {
//             show_product_menu.value = false;
//         }
//     }
// }

// onMounted(() => {
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
// });

// onUnmounted(() => {
//     if (typeof window !== 'undefined') {
//         window.removeEventListener('resize', checkScreenSize);
//     }
// });
</script>
