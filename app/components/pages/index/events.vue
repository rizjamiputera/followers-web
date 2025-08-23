<template>
    <section v-if="first_event" class="flex flex-col gap-4">
        <DefaultTitle class="text-green-main">Event</DefaultTitle>

        <div v-if="first_event" class="w-full flex gap-2">
            <div class="w-1/3 ">
                <Image :src="first_event.image_md"
                    class="aspect-3/4 rounded-lg bg-cover bg-no-repeat bg-green-main/30" />
            </div>
            <div class="w-2/3">
                <div
                    class="w-full h-full flex sm:flex-col gap-2 border border-green-main/30 bg-green-main/3 rounded-xl p-3">
                    <DefaultBody class="line-clamp-1 font-bold">{{ first_event.title }}</DefaultBody>
                    <EventLocationSchedule :data="first_event" />
                    <DefaultBody class="flex-1 line-clamp-3">{{ first_event.excerpt }}</DefaultBody>
                    <ButtonLink :to="'/event/' + first_event.slug" class="btn-green">Baca Selengkapnya</ButtonLink>
                </div>
            </div>
        </div>

    </section>
    <section v-if="from_second_events.length">
        <div v-if="from_second_events.length" class="grid grid-cols-1 sm:grid-cols-3 md::grid-cols-3 gap-2">
            <template v-for="data in from_second_events">
                <NuxtLink :to="'/event/' + data.slug" prefetch-on="interaction"
                    class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <Image :src="data.image_md" class="w-33 sm:w-full aspect-3/4 rounded-lg bg-cover bg-no-repeat" />
                    <div class="flex-1">
                        <div class="flex flex-col gap-2">
                            <!-- <EventLocationSchedule :data :skipAddress="true" /> -->
                            <div class="badge badge-sm badge-outline-green">
                                <LucideMapPin :size="14" /> {{ data.location }}
                            </div>
                            <div class="badge badge-sm badge-outline-green">
                                <LucideCalendar :size="14" /> {{ dayjs(data.start_at).format('DD MMMM YYYY') }}
                            </div>
                            <div class="badge badge-sm badge-outline-green">
                                <LucideClock :size="14" /> {{ formatTime(data.start_at) }} sd {{
                                    formatTime(data.start_at) }}
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <DefaultBody class="line-clamp-1 font-bold">{{ data.title }}</DefaultBody>
                            <DefaultBody class="line-clamp-3">{{ data.excerpt }}</DefaultBody>
                        </div>
                    </div>
                </NuxtLink>
            </template>
        </div>
    </section>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideCalendar, LucideClock, LucideMapPin } from 'lucide-vue-next';
import ButtonLink from '~/components/button-link.vue';

const EventsStore = useUpcomingEventStore()
const { from_second_events, first_event } = storeToRefs(EventsStore);
const { get } = EventsStore;
onMounted(() => {
    EventsStore.parameters.page = 1;
    if (!EventsStore.data) {
        get();
    }
})

</script>

<style></style>
