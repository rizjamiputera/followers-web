<template>
    <header data-theme="light" class="fixed z-50 navbar bg-white/80 backdrop-blur-sm shadow-sm w-screen">
        <div class="w-full mx-auto relative">
            <div class="flex justify-between px-2 md:px-6">
                <div class="navbar-start gap-4 max-w-60">
                    <!-- open close side menu -->
                    <label for="my-drawer"
                        class="btn bg-green-main border-1 border-white h-9 p-3 rounded-xl shadow-none lg:hidden">
                        <svg-menu-bar class="w-3" />
                    </label>

                    <NuxtLink to="/" prefetch-on="interaction">
                        <img src="/logo-hitam.webp" alt="Followers Logo" class="h-10">
                    </NuxtLink>
                </div>
                <div class="navbar-center hidden lg:flex">
                </div>
                <div class="navbar-end gap-5">
                    <ClientOnly>
                        <ButtonLink v-if="!user" to="/auth/login" prefetch-on="interaction"
                            class="btn-white font-medium h-9">
                            Login
                        </ButtonLink>
                        <div v-else class="dropdown dropdown-bottom dropdown-left">
                            <div tabindex="0" class="flex items-center gap-2">
                                <div class="text-green-main text-sm font-medium truncate max-sm:max-w-30">
                                    {{ user.name }}
                                </div>
                                <div role="button" class="btn btn-lg btn-active btn-circle bg-indigo-300 border-0">
                                    <Avatar :avatar="user.avatar_md" :name="user.name" />
                                </div>
                            </div>
                            <div tabindex="0"
                                class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <div class="p-2 flex flex-col gap-1">
                                    <div class="text-green-main font-medium">{{ user.name }}</div>
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
                                        <NuxtLink to="/" class="rounded-full justify-between">
                                            Go to home
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
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideArrowRight } from 'lucide-vue-next';

const AuthStore = useAuthStore();

const { user } = storeToRefs(AuthStore);
const { handleLogout } = AuthStore;

const show_product_menu = ref<boolean>(false);


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
