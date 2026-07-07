<template>
    <div class="rounded-2xl border border-green-main/15 bg-green-main/[0.03] divide-y divide-green-main/10">
        <!-- Location + address -->
        <div class="flex items-start gap-3 p-3.5">
            <div class="grid place-items-center w-9 h-9 rounded-xl bg-green-main/10 text-green-main shrink-0">
                <LucideMapPin :size="18" />
            </div>
            <div class="min-w-0 flex-1">
                <div class="font-semibold text-gray-800 leading-snug break-words">{{ data.location }}</div>
                <div v-if="!skipAddress && data.address"
                    class="text-sm text-gray-500 whitespace-pre-wrap break-words mt-0.5 leading-snug">
                    {{ data.address }}
                </div>
            </div>
        </div>

        <!-- Schedule -->
        <div class="flex items-start gap-3 p-3.5">
            <div class="grid place-items-center w-9 h-9 rounded-xl bg-green-main/10 text-green-main shrink-0">
                <LucideCalendarDays :size="18" />
            </div>
            <div class="min-w-0 flex-1 text-sm">
                <template v-if="sameDay">
                    <div class="font-medium text-gray-800">{{ dayjs(data.start_at).format('DD MMMM YYYY') }}</div>
                    <div class="flex items-center gap-1.5 text-gray-500 mt-0.5">
                        <LucideClock :size="14" class="shrink-0" />
                        <span v-if="data.end_at">
                            {{ formatTime(data.start_at) }} &ndash; {{ formatTime(data.end_at) }} {{ userTimezone() }}
                        </span>
                        <span v-else>{{ formatTimeTz(data.start_at) }}</span>
                    </div>
                </template>
                <template v-else>
                    <div class="flex items-baseline gap-2">
                        <span class="text-xs text-gray-400 w-12 shrink-0">Mulai</span>
                        <span class="font-medium text-gray-800">{{ formatDateTimeTz(data.start_at) }}</span>
                    </div>
                    <div v-if="data.end_at" class="flex items-baseline gap-2 mt-1">
                        <span class="text-xs text-gray-400 w-12 shrink-0">Selesai</span>
                        <span class="font-medium text-gray-800">{{ formatDateTimeTz(data.end_at) }}</span>
                    </div>
                </template>
            </div>
        </div>

        <!-- Pemateri (optional, provided by parent) -->
        <slot name="pemateri" />
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideCalendarDays, LucideClock, LucideMapPin } from 'lucide-vue-next';
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
