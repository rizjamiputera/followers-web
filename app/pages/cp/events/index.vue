<template>
    <CpEventTable />
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.EVENT, Permission.READ)) {
                return navigateTo('/cp')
            }
        }
    ]
});

const EventsStore = useEventsStore()
const { get } = EventsStore;
onMounted(() => {
    EventsStore.reset();
    EventsStore.parameters.page = 1;
    get();
})
</script>

<style></style>
