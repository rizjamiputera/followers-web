<template>
    <div class="border border-gray-300 rounded-lg overflow-hidden">
        <div class="border-b p-2 bg-gray-50 flex flex-wrap gap-1">
            <!-- Toolbar buttons -->
            <button @click="editor?.chain().focus().toggleBold().run()"
                :class="{ 'bg-blue-500 text-white': editor?.isActive('bold') }"
                class="px-2 py-1 text-sm border rounded hover:bg-blue-500 hover:text-white">
                <strong>B</strong>
            </button>
            <button @click="editor?.chain().focus().toggleItalic().run()"
                :class="{ 'bg-blue-500 text-white': editor?.isActive('italic') }"
                class="px-2 py-1 text-sm border rounded hover:bg-blue-500 hover:text-white">
                <em>I</em>
            </button>
            <button @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'bg-blue-500 text-white': editor?.isActive('heading', { level: 1 }) }"
                class="px-2 py-1 text-sm border rounded hover:bg-blue-500 hover:text-white">
                H1
            </button>
            <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'bg-blue-500 text-white': editor?.isActive('heading', { level: 2 }) }"
                class="px-2 py-1 text-sm border rounded hover:bg-blue-500 hover:text-white">
                H2
            </button>
            <button @click="editor?.chain().focus().toggleBulletList().run()"
                :class="{ 'bg-blue-500 text-white': editor?.isActive('bulletList') }"
                class="px-2 py-1 text-sm border rounded hover:bg-blue-500 hover:text-white">
                • List
            </button>
            <button @click="editor?.chain().focus().toggleOrderedList().run()"
                :class="{ 'bg-blue-500 text-white': editor?.isActive('orderedList') }"
                class="px-2 py-1 text-sm border rounded hover:bg-blue-500 hover:text-white">
                1. List
            </button>
        </div>
        <EditorContent :editor="editor" class="prose max-w-none p-4 min-h-[300px] focus:outline-none" />
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const props = defineProps<{
    modelValue?: any
}>()

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>()

let isUpdatingFromEditor = false

const editor = useEditor({
    extensions: [
        StarterKit,
        Image.configure({
            HTMLAttributes: {
                class: 'max-w-full h-auto rounded-lg',
            },
        }),
    ],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
        isUpdatingFromEditor = true
        emit('update:modelValue', editor.getJSON())
        nextTick(() => {
            isUpdatingFromEditor = false
        })
    },
})

watch(() => props.modelValue, (newValue) => {
    if (!isUpdatingFromEditor && editor.value && newValue) {
        const currentContent = JSON.stringify(editor.value.getJSON())
        const newContent = JSON.stringify(newValue)
        
        if (currentContent !== newContent) {
            editor.value.commands.setContent(newValue, { emitUpdate: false })
        }
    }
}, { deep: true })

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>
