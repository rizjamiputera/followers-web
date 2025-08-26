<!-- <li v-if="can(Module.ARTICLE, Permission.CREATE)">
    <details open>
        <summary>My Article</summary>
        <ul>
            <li>
                <NuxtLink to="/cp/my-articles" prefetch-on="interaction">Semua</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/cp/my-articles/published" prefetch-on="interaction">Published</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/cp/my-articles/draft" prefetch-on="interaction">Draft</NuxtLink>
            </li>
        </ul>
    </details>
</li> -->
<template>
    <!-- Sidebar content here -->
    <div ref="drawerMenu" class="menu bg-base-200 text-base-content h-full w-60 p-4 text-base">
        <div class="h-full flex flex-col gap-2 max-h-full overflow-y-auto">
            <div class="flex-1">
                <ul class="">
                    <li>
                        <NuxtLink to="/" prefetch-on="interaction">
                            <LucideArrowLeft :size="14" /> Back to website
                        </NuxtLink>
                    </li>
                </ul>
                <template v-for="n in 1" :key="n">
                    <hr class="my-4">
                    <ul class="">
                        <div class="font-bold text-gray-400 px-2">Managemen Kontent</div>
                        <ClientOnly>
                            <li v-if="can(Module.ARTICLE, Permission.READ)">
                                <NuxtLink to="/cp/articles" prefetch-on="interaction">Articles</NuxtLink>
                            </li>
                            <li v-if="can(Module.EVENT, Permission.READ)">
                                <NuxtLink to="/cp/events" prefetch-on="interaction">Events</NuxtLink>
                            </li>
                            <li v-if="can(Module.USER, Permission.READ)">
                                <NuxtLink to="/cp/users" prefetch-on="interaction">Users</NuxtLink>
                            </li>
                        </ClientOnly>
                    </ul>
                </template>

                <ClientOnly>
                    <template v-if="can(Module.ARTICLE, Permission.CREATE) || can(Module.EVENT, Permission.CREATE)">
                        <hr class="my-4">
                        <div class="font-bold text-gray-400 px-2">Data Saya</div>
                        <ul class="">
                            <li v-if="can(Module.ARTICLE, Permission.CREATE)">
                                <NuxtLink to="/cp/my-articles" prefetch-on="interaction">My Articles</NuxtLink>
                            </li>
                            <li v-if="can(Module.EVENT, Permission.CREATE)">
                                <NuxtLink to="/cp/my-events" prefetch-on="interaction">My Events</NuxtLink>
                            </li>
                        </ul>
                    </template>
                </ClientOnly>

                <ClientOnly>
                    <template v-if="user?.role == 'SUPERADMIN'">
                        <hr class="my-4">
                        <div class="font-bold text-gray-400 px-2">SUPERADMIN ONLY</div>
                        <ul class="">
                            <li>
                                <NuxtLink to="/cp/superadmin/error-log" prefetch-on="interaction">Error Log</NuxtLink>
                            </li>
                        </ul>
                    </template>
                </ClientOnly>
            </div>
            <Version class="text-white text-center text-xs font-light" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { LucideArrowLeft } from 'lucide-vue-next';
import { Module, Permission } from '~/interfaces/user-interface';

const AuthStore = useAuthStore();
const { can, user } = storeToRefs(AuthStore);

const drawerMenu = ref<HTMLElement | null>(null)
function triggerDrawer() {
    const drawerToggle = document.getElementById("my-drawer") as HTMLInputElement
    if (drawerToggle) {
        drawerToggle.checked = !drawerToggle.checked // toggle like the label would
    }
}

function handleClick(e: Event) {
    const target = e.target as HTMLElement
    // Only trigger if clicking a link or button inside the menu
    if (target.closest('a, button')) {
        triggerDrawer()
    }
}

onMounted(() => {
    drawerMenu.value?.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
    drawerMenu.value?.removeEventListener('click', handleClick)
})
</script>

<style></style>
