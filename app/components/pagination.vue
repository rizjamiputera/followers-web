<template>
    <div class="join">
        <button
            class="join-item btn btn-sm text-green-main border-y-green-main/20 border-l-green-main/20 rounded-l-full !bg-green-main/5"
            :disabled="Number(page) == 1" @click="$emit('prev')">«</button>
        <button class="join-item btn btn-sm text-green-main border-y-green-main/20">Page {{ page }}</button>
        <button
            class="join-item btn btn-sm text-green-main border-y-green-main/20 border-r-green-main/20 rounded-r-full !bg-green-main/5"
            :disabled="Number(page) == last_page" @click="() => {
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
