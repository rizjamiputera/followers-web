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
    <div ref="drawerMenu" class="menu bg-base-200 text-base-content min-h-full w-60 p-4 text-base">
        <ul class="">
            <!-- Sidebar content here -->
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

        <hr class="my-4">
        <ul class="">
            <!-- Sidebar content here -->
            <ClientOnly>
                <li v-if="can(Module.ARTICLE, Permission.CREATE)">
                    <NuxtLink to="/cp/my-articles" prefetch-on="interaction">My Articles</NuxtLink>
                </li>
                <li v-if="can(Module.EVENT, Permission.CREATE)">
                    <NuxtLink to="/cp/my-events" prefetch-on="interaction">My Events</NuxtLink>
                </li>
            </ClientOnly>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

const AuthStore = useAuthStore();
const { can } = storeToRefs(AuthStore);

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
