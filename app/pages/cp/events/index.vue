<template>
    <CpEventTable />
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'control-panel'
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
