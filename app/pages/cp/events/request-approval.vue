<template>
    <CpEventTable subtitle="- Request Approval" />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
});

const EventsStore = useEventsStore()
const { get } = EventsStore;
onMounted(() => {
    EventsStore.reset();
    EventsStore.status = "ON_REVIEW";
    get();
})
</script>

<style></style>
