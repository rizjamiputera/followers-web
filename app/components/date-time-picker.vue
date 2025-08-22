<template>
    <ClientOnly>
        <!-- <Calendar /> -->
        <DatePicker v-model="_value" mode="dateTime">
            <template #default="{ togglePopover }">
                <Button class="btn btn-outline border-neutral/25 btn-sm font-normal text-nowrap" @click="togglePopover">
                    <div class="flex justify-between gap-2 items-center">
                        <div>
                            {{ _value ? dayjs(_value).format('D MMMM YYYY HH:mm') : label }}
                        </div>
                        <LucideCalendar :size="12" />
                    </div>
                </Button>
            </template>
        </DatePicker>
    </ClientOnly>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideCalendar } from 'lucide-vue-next';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

interface Props {
    modelValue: string | null,
    label?: string
}

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
    label: 'Pilih tanggal',
})

const _value = ref<string>(props.modelValue || "");

watch(_value, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>

<style></style>
