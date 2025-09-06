<template>
    <div class="flex flex-col gap-4" v-if="drawEvents.length">
        <div class="text-green-main font-bold text-xl">Event Lainnya</div>

        <div class="flex flex-col gap-2">
            <template v-for="data in drawEvents" :key="data.id">
                <NuxtLink :to="'/event/' + data.slug" prefetch-on="interaction"
                    class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                    <Image :src="data.image_portrait_md"
                        class="w-33 sm:w-full aspect-3/4 rounded-lg bg-cover bg-no-repeat" />
                    <div class="flex-1">
                        <div class="flex flex-col gap-2">
                            <!-- <EventLocationSchedule :data :skipAddress="true" /> -->
                            <div class="badge badge-sm badge-outline-green">
                                <LucideMapPin :size="14" /> {{ data.location }}
                            </div>
                            <div class="badge badge-sm badge-outline-green">
                                <LucideCalendar :size="14" /> {{ dayjs(data.start_at).format('DD MMMM YYYY') }}
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
        <!-- <div v-else class="text-lg text-center font-light text-green-main/80">
            Belum ada Event
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideCalendar, LucideMapPin } from 'lucide-vue-next';

const props = defineProps<{
    excludeSlug?: string
}>()

const EventsStore = useUpcomingEventStore()
const { events } = storeToRefs(EventsStore);
const { get } = EventsStore;
onMounted(() => {
    EventsStore.parameters.page = 1;
    if (!EventsStore.data) {
        get();
    }
})

const drawEvents = computed(() => {
    if (!props.excludeSlug) return events.value;

    return events.value.filter(e => e.slug != props.excludeSlug);
})

</script>

<style></style>
