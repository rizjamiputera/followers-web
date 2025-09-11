<template>
    <section>
        <DefaultTitle class="text-green-main">Kegiatan The Followers</DefaultTitle>
        <div class="grid grid-cols-1 sm:grid-cols-3 md::grid-cols-3 gap-2">
            <template v-for="data in events">
                <EventCard :data />
            </template>

            <CardSkeleton v-if="isLoading" v-for="m in 6" :key="m" />
        </div>
        <div v-if="isEmpty" class="text-lg text-center font-light text-green-main/80 mt-10">
            Nantikan kegiatan kami berikutnya
        </div>
    </section>

    <section class="mt-20">
        <DefaultTitle class="text-green-main">Kegiatan yang lalu</DefaultTitle>
        <div class="grid grid-cols-1 sm:grid-cols-3 md::grid-cols-3 gap-2">
            <template v-for="data in PastEvent">
                <EventCard :data />
            </template>

            <CardSkeleton v-if="isPastLoading" v-for="m in 6" :key="m" />
        </div>
        <div v-if="isPastEmtpy" class="text-lg text-center font-light text-green-main/80 mt-10">
            Nantikan kegiatan kami berikutnya
        </div>
    </section>
</template>

<script lang="ts" setup>
import CardSkeleton from '~/components/event/card-skeleton.vue';

const UpcomingEventsStore = useUpcomingEventStore()
const { events, from_second_events, first_event, isEmpty, isLoading } = storeToRefs(UpcomingEventsStore);
const { get } = UpcomingEventsStore;

const PastEventStore = usePastEventStore()
const { events: PastEvent, isEmpty: isPastEmtpy, isLoading: isPastLoading } = storeToRefs(PastEventStore);
const { get: getPast } = PastEventStore;


onMounted(() => {
    recordVisit();

    UpcomingEventsStore.parameters.page = 1;
    if (!UpcomingEventsStore.data) {
        get();
    }

    if (!PastEventStore.data) {
        getPast();
    }
})
</script>

<style></style>
