<template>
    <div>

    </div>
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.USER, Permission.READ)) {
                return navigateTo('/cp')
            }
        }
    ]
})

</script>

<style></style>
