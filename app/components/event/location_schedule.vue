<template>
    <EventLocation>{{ data.location }}</EventLocation>

    <div v-if="!skipAddress"
        class="border-1 border-green-main/30 rounded-lg text-sm font-light max-w-full break-words whitespace-pre-wrap py-2 px-3">
        {{ data.address }}
    </div>

    <template v-if="sameDay">
        <div v-if="data.end_at" class="flex flex-wrap gap-1">
            <div class="badge badge-outline-green bg-transparent">
                <LucideCalendar :size="14" /> {{ dayjs(data.start_at).format('DD MMMM YYYY') }}
            </div>
            <div class="badge badge-outline-green bg-transparent">
                <LucideClock :size="14" />
                {{ formatTime(data.start_at) }} sd {{ formatTime(data.end_at) }} {{ userTimezone() }}
            </div>
            <!-- <div class="badge badge-outline-green bg-transparent">
                {{ userTimezone() }}
            </div> -->
        </div>
        <div v-else class="flex flex-wrap gap-1">
            <div class="badge badge-outline-green bg-transparent">
                <LucideCalendar :size="14" /> {{ dayjs(data.start_at).format('DD-MMM-YY') }}
            </div>
            <div class="badge badge-outline-green bg-transparent">
                <LucideClock :size="14" /> {{ formatTimeTz(data.start_at) }}
            </div>
        </div>
    </template>
    <template v-else>
        <div class="badge badge-outline-green bg-transparent text-nowrap text-xs">
            <LucideClock :size="14" /> <span class="min-w-12">Dari</span> : {{ formatDateTimeTz(data.start_at) }}
        </div>
        <div class="badge badge-outline-green bg-transparent text-nowrap text-xs" v-if="data.end_at">
            <LucideClock :size="14" /> <span class="min-w-12">Sampai</span> : {{ formatDateTimeTz(data.end_at) }}
        </div>
    </template>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideCalendar, LucideClock, LucideMapPin } from 'lucide-vue-next';
import type { Event } from '~/interfaces/event-interface';

const props = defineProps<{
    data: Event | Partial<Event>
    skipAddress?: boolean
}>()

const sameDay = computed<boolean>(() => {
    if (!props.data) return true;
    if (!props.data.start_at) return true;
    if (!props.data.end_at) return true;

    const startDay = dayjs(props.data.start_at).format('DD-MM-YY');
    const endDay = dayjs(props.data.end_at).format('DD-MM-YY');

    return startDay == endDay;
})
</script>

<style></style>
