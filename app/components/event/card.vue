<template>
    <NuxtLink :to="'/event/' + data.slug" prefetch-on="interaction"
        class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
        <Image :src="data.image_portrait_md" class="w-33 sm:w-full aspect-3/4 rounded-lg bg-cover bg-no-repeat" />
        <div class="flex-1">
            <div class="flex flex-col gap-2">
                <!-- <EventLocationSchedule :data :skipAddress="true" /> -->
                <EventLocation>{{ data.location }}</EventLocation>
                <div class="badge badge-sm badge-outline-green bg-transparent">
                    <LucideCalendar :size="14" /> {{ dayjs(data.start_at).format('DD MMMM YYYY') }}
                </div>
                <div class="badge badge-sm badge-outline-green bg-transparent">
                    <LucideClock :size="14" /> {{ formatTime(data.start_at) }} sd {{
                        formatTime(data.start_at) }}
                </div>
            </div>
            <div class="flex flex-col gap-2 mt-2">
                <DefaultBody class="line-clamp-1 font-bold">{{ data.title }}</DefaultBody>
                <DefaultBody class="line-clamp-3">{{ data.excerpt }}</DefaultBody>

                <!-- Tags -->
                <TagList v-if="data.tags" :tags="data.tags" :clickable="false" size="sm" class="mt-2" />
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Event } from '~/interfaces/event-interface';


defineProps<{
    data: Event
}>()

</script>

<style></style>
