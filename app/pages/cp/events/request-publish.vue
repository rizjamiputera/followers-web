<template>
    <CpEventTable subtitle="- Request Publish" />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
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
