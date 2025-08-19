<template>
    <div class="border border-gray-300 rounded-xl">
        <div
            class="tiptap-button-container rounded-t-xl z-40 bg-white-main border-b border-b-green-main/30 p-3 flex flex-wrap justify-center gap-1 sticky top-16">
            <!-- Toolbar buttons -->
            <Button @click="editor?.chain().focus().toggleBold().run()"
                :disabled="!editor?.can().chain().focus().toggleBold().run()"
                :class="{ 'btn-green': editor?.isActive('bold') }" class="">
                <strong>B</strong>
            </Button>
            <Button @click="editor?.chain().focus().toggleItalic().run()"
                :disabled="!editor?.can().chain().focus().toggleItalic().run()"
                :class="{ 'btn-green': editor?.isActive('italic') }">
                <em>I</em>
            </Button>
            <Button @click="editor?.chain().focus().toggleStrike().run()"
                :disabled="!editor?.can().chain().focus().toggleStrike().run()"
                :class="{ 'btn-green': editor?.isActive('strike') }">
                <LucideStrikethrough :size="14" />
            </Button>
            <Button @click="editor?.chain().focus().toggleCode().run()"
                :disabled="!editor?.can().chain().focus().toggleCode().run()"
                :class="{ 'btn-green': editor?.isActive('code') }">
                Code
            </Button>
            <Button @click="editor?.chain().focus().unsetAllMarks().run()">
                Clear Marks
            </Button>
            <Button @click="editor?.chain().focus().setParagraph().run()"
                :class="{ 'btn-green': editor?.isActive('paragraph') }">
                P
            </Button>
            <Button @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'btn-green': editor?.isActive('heading', { level: 1 }) }">
                H1
            </Button>
            <Button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'btn-green': editor?.isActive('heading', { level: 2 }) }">
                H2
            </Button>
            <Button @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'btn-green': editor?.isActive('heading', { level: 3 }) }">
                H3
            </Button>
            <Button @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
                :class="{ 'btn-green': editor?.isActive('heading', { level: 4 }) }">
                H4
            </Button>
            <!-- <Button @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
                :class="{ 'btn-green': editor?.isActive('heading', { level: 5 }) }">
                H5
            </Button>
            <Button @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
                :class="{ 'btn-green': editor?.isActive('heading', { level: 6 }) }">
                H6
            </Button> -->
            <Button @click="editor?.chain().focus().toggleBulletList().run()"
                :class="{ 'btn-green': editor?.isActive('bulletList') }">
                • List
            </Button>
            <Button @click="editor?.chain().focus().toggleOrderedList().run()"
                :class="{ 'btn-green': editor?.isActive('orderedList') }">
                1. List
            </Button>
            <Button @click="editor?.chain().focus().toggleCodeBlock().run()"
                :class="{ 'btn-green': editor?.isActive('codeBlock') }">
                <LucideCode2 :size="14" />
            </Button>
            <Button @click="editor?.chain().focus().toggleBlockquote().run()"
                :class="{ 'btn-green': editor?.isActive('blockquote') }">
                <LucideQuote :size="12" />
            </Button>
            <Button @click="editor?.chain().focus().setHorizontalRule().run()">Horizontal rule</Button>
            <Button @click="editor?.chain().focus().setHardBreak().run()">Hard break</Button>
            <Button @click="editor?.chain().focus().undo().run()"
                :disabled="!editor?.can().chain().focus().undo().run()">
                <LucideUndo2 :size="14" />
            </Button>
            <Button @click="editor?.chain().focus().redo().run()"
                :disabled="!editor?.can().chain().focus().redo().run()">
                <LucideRedo2 :size="14" />
            </Button>
            <!-- <Button @click="addImage">
                <LucideImage :size="14" /> Image
            </Button> -->
            <Button @click="fileInput?.click()">
                <LucideImage :size="15" /> Image 2
            </Button>
        </div>
        <EditorContent :editor="editor" class="prose max-w-none p-4 min-h-[300px] focus:outline-none" />

        <input type="file" ref="fileInput" class="hidden" accept="image/jpg, image/jpeg, image/png"
            @change="handleFileChange" />
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { LucideCode2, LucideImage, LucideQuote, LucideRedo2, LucideStrikethrough, LucideUndo2 } from 'lucide-vue-next';

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
        // Image,
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

// image
const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run()
    }
};

// Handle file input
const fileInput = ref<HTMLInputElement | null>(null)
const handleFileChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    // upload to your NestJS backend
    const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    })

    const { url } = await res.json()

    editor.value?.chain().focus().setImage({ src: url }).run()
}



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


<style scoped>
@reference "@/assets/css/main.css";

.tiptap-button-container button {
    @apply btn-sm !rounded-lg border-green-main/40
}
</style>
