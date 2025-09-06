<template>
    <!-- ARTICLE IMAGE -->
    <div class="flex flex-col gap-1">
        <Image v-if="data.image_portrait || data.image" :full-image="true"
            :src="data.image_portrait ? data.image_portrait : data.image!" :alt="data.title"
            class-name="w-full rounded-2xl" />
        <div v-else class-name="w-full aspect-3/4 bg-green-main rounded-2xl" />

        <div class="text-lg md:text-2xl font-semibold mb-2">{{ data.title }}</div>

        <!-- location & schedule time -->
        <EventLocationSchedule :data />

        <!-- content -->
        <div v-if="data.content" class="prose max-w-none">
            <WysiwygRenderer :content="data.content.content" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Event } from '~/interfaces/event-interface';

const props = defineProps<{
    data: Event | Partial<Event>
}>()

const sameDay = computed<boolean>(() => {
    if (!props.data.start_at) return true;
    if (!props.data.end_at) return true;

    const startDay = dayjs(props.data.start_at).format('dd-mm-yyyy');
    const endDay = dayjs(props.data.end_at).format('dd-mm-yyyy');

    return startDay == endDay;
})

</script>

<style></style>
