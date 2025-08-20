<template>
    <Button class="btn-xs btn-circle btn-green" @click="fileInput?.click()">
        <LucidePencil :size="12" />
    </Button>

    <input type="file" ref="fileInput" class="hidden" accept="image/jpg, image/jpeg, image/png"
        @change="handleFileChange" />
</template>

<script lang="ts" setup>
import { LucidePencil } from 'lucide-vue-next';
import type { PhotoContent } from '~/interfaces/article-interface';

const emits = defineEmits(['uploaded'])
const fileInput = ref<HTMLInputElement | null>(null)
const handleFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    try {
        const formData = new FormData()
        formData.append('photo', file)

        // upload to your NestJS backend
        const photos = await Api.post('/v1/photo-content/main-image', formData) as PhotoContent[]

        emits('uploaded', photos)
    } catch (error) {
        toastError(error);
    } finally {
        // ✅ clear the file input so same file can be reselected
        input.value = ''
    }
}
</script>

<style></style>
