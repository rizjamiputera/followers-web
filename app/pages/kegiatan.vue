<template>
    <!-- <template v-if="false">
    <section v-if="first_event" class="flex flex-col gap-4">

        <div v-if="first_event"
            class="w-full flex max-sm:flex-col gap-2 max-sm:border border-green-main/30 max-sm:bg-green-main/3 rounded-xl">
            <NuxtLink :to="'/event/' + first_event.slug" prefetch-on="interaction" class="sm:w-1/3 max-sm:p-3">
                <Image :src="first_event.image_md"
                    class="aspect-3/4 rounded-lg bg-cover bg-no-repeat bg-green-main/30" />
            </NuxtLink>
            <div class="sm:w-2/3">
                <div
                    class="w-full h-full flex flex-col gap-2 sm:border border-green-main/30 sm:bg-green-main/3 rounded-xl p-3">
                    <DefaultBody class="line-clamp-1 font-bold">{{ first_event.title }}</DefaultBody>
                    <EventLocationSchedule :data="first_event" />
                    <DefaultBody class="flex-1 whitespace-pre-wrap">{{ first_event.excerpt }}</DefaultBody>
                    <ButtonLink :to="'/event/' + first_event.slug" class="btn-green">Baca Selengkapnya</ButtonLink>
                </div>
            </div>
        </div>
    </section>
    </template> -->

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

    <section v-if="isPastLoading && !isPastEmtpy" class="mt-20">
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
import dayjs from 'dayjs';
import { LucideCalendar, LucideClock, LucideMapPin } from 'lucide-vue-next';
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
