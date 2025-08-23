<template>
    <div class="badge badge-outline-green">
        <LucideMapPin :size="14" /> {{ data.location }}
    </div>
    <div class="border-1 border-green-main/30 rounded-lg text-sm font-light w-min whitespace-pre py-2 px-3">
        {{ data.address }}
    </div>

    <template v-if="sameDay">
        <div v-if="data.end_at" class="flex gap-1">
            <div class="badge badge-outline-green">
                <LucideCalendar :size="14" /> {{ dayjs(data.start_at).format('DD MMMM YYYY') }}
            </div>
            <div class="badge badge-outline-green">
                <LucideClock :size="14" /> {{ formatTime(data.start_at) }} sd {{ formatTime(data.start_at) }}
            </div>
            <div class="badge badge-outline-green">
                {{ userTimezone() }}
            </div>
        </div>
        <template v-else>
            <div class="badge badge-outline-green">
                <LucideCalendar :size="14" /> {{ dayjs(data.start_at).format('DD-MMM-YY') }}
            </div>
            <div class="badge badge-outline-green">
                <LucideClock :size="14" /> {{ formatDateTimeTz(data.start_at) }}
            </div>
        </template>
    </template>
    <template v-else>
        <div class="badge badge-outline-green">
            <LucideClock :size="14" /> <span class="min-w-12">Dari</span> : {{ formatDateTimeTz(data.start_at) }}
        </div>
        <div class="badge badge-outline-green" v-if="data.end_at">
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
}>()

const sameDay = computed<boolean>(() => {
    if (!props.data) return true;
    if (!props.data.start_at) return true;
    if (!props.data.end_at) return true;

    const startDay = dayjs(props.data.start_at).format('dd-mm-yyyy');
    const endDay = dayjs(props.data.end_at).format('dd-mm-yyyy');

    return startDay == endDay;
})
</script>

<style></style>
