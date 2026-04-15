<template>
    <div v-html="renderedContent" class="tiptap-content prose max-w-none"></div>
</template>

<script lang="ts" setup>
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

interface Props {
    content: Record<string, any>
}

const props = defineProps<Props>()

// @tiptap/html's default export resolves to the browser build under
// Nuxt/Vite SSR (the `node` export condition is not honoured), which
// silently produces an empty string. Pick the DOM-free server build
// on the server and the regular build in the browser — both yield
// identical HTML, so no hydration mismatch.
const { generateHTML } = import.meta.server
    ? await import('@tiptap/html/server')
    : await import('@tiptap/html')

const renderedContent = computed(() => {
    if (!props.content) return ''
    try {
        return generateHTML(props.content, [StarterKit, Image])
    } catch (error) {
        console.error('Error rendering TipTap content:', error)
        return '<p>Error rendering content</p>'
    }
})
</script>
