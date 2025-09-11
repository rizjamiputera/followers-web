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
                        <div class="font-bold text-gray-400 px-2">Home Page</div>
                        <li>
                            <NuxtLink to="/cp" prefetch-on="interaction">Dashboard</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/cp/articles/featured" prefetch-on="interaction">Featured Article</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/cp/events/featured" prefetch-on="interaction">Featured Events</NuxtLink>
                        </li>

                        <hr class="my-4">
                        <div class="font-bold text-gray-400 px-2">Managemen Kontent</div>
                        <ClientOnly>

                            <!-- ARTICLE -->
                            <li v-if="can(Module.ARTICLE, Permission.READ)">
                                <details>
                                    <summary>Article</summary>
                                    <ul>
                                        <li>
                                            <NuxtLink to="/cp/articles" prefetch-on="interaction">Semua</NuxtLink>
                                        </li>
                                        <li v-if="can(Module.ARTICLE, Permission.APPROVE)">
                                            <NuxtLink to="/cp/articles/request-approval" prefetch-on="interaction">
                                                Request Approval
                                            </NuxtLink>
                                        </li>
                                        <li v-if="can(Module.ARTICLE, Permission.PUBLISH)">
                                            <NuxtLink to="/cp/articles/request-publish" prefetch-on="interaction">
                                                Request Publish
                                            </NuxtLink>
                                        </li>
                                        <li v-if="can(Module.ARTICLE, Permission.PUBLISH)">
                                            <NuxtLink to="/cp/articles/published" prefetch-on="interaction">Published
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </details>
                            </li>

                            <!-- EVENT -->
                            <li v-if="can(Module.EVENT, Permission.READ)">
                                <details>
                                    <summary>Event</summary>
                                    <ul>
                                        <li>
                                            <NuxtLink to="/cp/events" prefetch-on="interaction">Semua</NuxtLink>
                                        </li>
                                        <li v-if="can(Module.EVENT, Permission.APPROVE)">
                                            <NuxtLink to="/cp/events/request-approval" prefetch-on="interaction">
                                                Request Approval
                                            </NuxtLink>
                                        </li>
                                        <li v-if="can(Module.EVENT, Permission.PUBLISH)">
                                            <NuxtLink to="/cp/events/request-publish" prefetch-on="interaction">
                                                Request Publish
                                            </NuxtLink>
                                        </li>
                                        <li v-if="can(Module.EVENT, Permission.PUBLISH)">
                                            <NuxtLink to="/cp/events/published" prefetch-on="interaction">Published
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </details>
                            </li>

                            <li v-if="can(Module.USER, Permission.READ)">
                                <NuxtLink to="/cp/users" prefetch-on="interaction">Users</NuxtLink>
                            </li>

                            <!-- TAG MANAGEMENT -->
                            <li
                                v-if="can(Module.ARTICLE, Permission.CREATE) || can(Module.EVENT, Permission.CREATE) || can(Module.ARTICLE, Permission.EDIT) || can(Module.EVENT, Permission.EDIT)">
                                <NuxtLink to="/cp/tags" prefetch-on="interaction">Tags</NuxtLink>
                            </li>
                        </ClientOnly>
                    </ul>
                </template>

                <ClientOnly>
                    <template v-if="can(Module.ARTICLE, Permission.CREATE) || can(Module.EVENT, Permission.CREATE)">
                        <hr class="my-4">
                        <div class="font-bold text-gray-400 px-2">Content Saya</div>
                        <ul class="">
                            <li>
                                <NuxtLink to="/cp/creator-dashboard" prefetch-on="interaction">
                                    Statistics
                                </NuxtLink>
                            </li>
                            <li v-if="can(Module.ARTICLE, Permission.CREATE)">
                                <NuxtLink to="/cp/my-articles" prefetch-on="interaction">Articles</NuxtLink>
                            </li>
                            <li v-if="can(Module.EVENT, Permission.CREATE)">
                                <NuxtLink to="/cp/my-events" prefetch-on="interaction">Events</NuxtLink>
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
            <Version class="text-center text-xs font-light" />
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
