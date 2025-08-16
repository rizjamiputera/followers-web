<template>
    <li v-if="menu.children && menu.children.length">
        <details>
            <summary class="text-[16px] text-white-main">{{ menu.name }}</summary>
            <ul class="p-2 z-10 bg-default">
                <template v-for="(child, i) in menu.children" :key="i">
                    <NavItem :menu="child" />
                </template>
            </ul>
        </details>
    </li>
    <li v-else>
        <NuxtLink :to="menu.link" prefetch-on="interaction" class="text-nowrap text-[16px] text-white-main">{{ menu.name
            }}
        </NuxtLink>
    </li>
</template>

<script lang="ts" setup>
import type { Menu } from '~/layouts/default.vue';

defineProps<{
    menu: Menu
}>()
</script>
