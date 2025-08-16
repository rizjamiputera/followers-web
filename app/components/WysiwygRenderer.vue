<template>
    <div v-html="renderedContent" class="tiptap-content prose max-w-none"></div>
</template>

<script lang="ts" setup>
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

interface Props {
    content: Record<string, any>
}

const props = defineProps<Props>()

const renderedContent = computed(() => {
    if (!props.content) return ''

    try {
        return generateHTML(props.content, [
            StarterKit,
            Image,
        ])
    } catch (error) {
        console.error('Error rendering TipTap content:', error)
        return '<p>Error rendering content</p>'
    }
})
</script>
