<template>
    <div class="join">
        <button class="join-item btn btn-sm rounded-l-full" :disabled="Number(page) == 1"
            @click="$emit('prev')">«</button>
        <button class="join-item btn btn-sm">Page {{ page }}</button>
        <button class="join-item btn btn-sm rounded-r-full" :disabled="Number(page) == last_page" @click="() => {
            const pageNum = Number(page)
            if (!isNaN(pageNum) && pageNum < last_page) {
                $emit('next')
            }
        }">»</button>
    </div>
</template>

<script lang="ts" setup>
defineEmits(['next', 'prev'])
const props = defineProps<{
    page: number | string
    last_page: number
}>();

</script>

<style></style>
