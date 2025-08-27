<template>
    <CpEventTable subtitle="Publised" />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
});

const EventsStore = useEventsStore()
const { get } = EventsStore;
onMounted(() => {
    EventsStore.reset();
    EventsStore.status = "PUBLISHED";
    get();
})
</script>

<style></style>
