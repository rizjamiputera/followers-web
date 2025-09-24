<template>
    <CpEventTable subtitle="- Request Publish" />
</template>

<script lang="ts" setup>
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.EVENT, Permission.PUBLISH)) {
                return navigateTo('/cp')
            }
        }
    ]
});

const EventsStore = useEventsStore()
const { get } = EventsStore;
onMounted(() => {
    EventsStore.reset();
    EventsStore.status = "APPROVED";
    get();
})
</script>

<style></style>
