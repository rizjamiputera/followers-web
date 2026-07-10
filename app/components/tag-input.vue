<template>
    <div class="form-control w-full">
        <label v-if="label" class="label">
            <span class="label-text">{{ label }}</span>
        </label>

        <div class="space-y-2">
            <!-- Tag input field -->
            <div class="relative">
                <input v-model="inputValue" @keydown="handleKeyDown" @input="handleInput" :placeholder="placeholder"
                    class="input input-bordered w-full" :class="{ 'input-error': error }" type="text" />

                <!-- Dropdown suggestions -->
                <div v-if="showSuggestions && inputValue.trim()"
                    class="absolute top-full left-0 right-0 z-50 bg-base-100 shadow-lg border border-indigo-300 rounded-lg max-h-48 overflow-y-auto">

                    <!-- Loading state -->
                    <div v-if="isLoading" class="px-4 py-2 text-center text-gray-500">
                        Searching...
                    </div>

                    <!-- Existing tag suggestions -->
                    <div v-for="(suggestion, index) in filteredSuggestions" :key="suggestion.id"
                        @click="selectSuggestion(suggestion)" class="px-4 py-2 hover:bg-base-200 cursor-pointer"
                        :class="{ 'bg-base-200': index === selectedSuggestionIndex }">
                        <span class="font-medium">{{ suggestion.name }}</span>
                        <span class="text-sm text-gray-500 ml-2">(existing tag)</span>
                    </div>

                    <!-- Create new tag option -->
                    <div v-if="!isLoading && inputValue.trim() && !filteredSuggestions.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase())"
                        @click="addNewTag(inputValue.trim())"
                        class="px-4 py-2 hover:bg-base-200 cursor-pointer border-t border-base-300"
                        :class="{ 'bg-base-200': selectedSuggestionIndex === filteredSuggestions.length }">
                        <span class="font-medium">Create "{{ inputValue.trim() }}"</span>
                        <span class="text-sm text-gray-500 ml-2">(new tag)</span>
                    </div>

                    <!-- No results -->
                    <div v-if="!isLoading && filteredSuggestions.length === 0 && inputValue.length >= 1"
                        class="px-4 py-2 text-center text-gray-500">
                        Press Enter to create "{{ inputValue.trim() }}"
                    </div>
                </div>
            </div>

            <!-- Selected tags display -->
            <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2">
                <div v-for="tag in selectedTags" :key="tag.id || tag.name" class="badge badge-primary gap-2 capitalize">
                    {{ tag.name }}
                    <button @click="removeTag(tag)" class="btn btn-xs btn-circle btn-ghost" type="button">
                        ✕
                    </button>
                </div>
            </div>
        </div>

        <p v-if="error" class="mt-1 text-xs text-error">{{ error }}</p>

        <p v-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/interfaces/content-interface'

interface Props {
    modelValue?: string[]
    label?: string
    placeholder?: string
    error?: string
    hint?: string
    maxTags?: number
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Type to add tags...',
    maxTags: 10
})

const emit = defineEmits<{
    'update:modelValue': [value: string[]]
}>()

// Reactive data
const inputValue = ref('')
const selectedTags = ref<Tag[]>([])
const availableTags = ref<Tag[]>([])
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)
const isLoading = ref(false)

// Computed
const filteredSuggestions = computed(() => {
    if (!inputValue.value) return []

    const query = inputValue.value.toLowerCase()
    return availableTags.value
        .filter(tag =>
            tag.name.toLowerCase().includes(query) &&
            !selectedTags.value.some(selected => selected.id === tag.id)
        )
        .slice(0, 10)
})

const canCreateNewTag = computed(() => {
    const trimmed = inputValue.value.trim()
    return trimmed.length > 0 &&
        !filteredSuggestions.value.some(t => t.name.toLowerCase() === trimmed.toLowerCase()) &&
        !selectedTags.value.some(t => t.name.toLowerCase() === trimmed.toLowerCase())
})

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        // Convert tag names back to tag objects
        selectedTags.value = newValue.map(tagName => {
            const existingTag = availableTags.value.find(t => t.name === tagName)
            return existingTag || { id: '', name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') }
        })
    } else {
        selectedTags.value = []
    }
}, { immediate: true })

// Methods
async function fetchTags(query: string) {
    if (!query || query.length < 1) {
        availableTags.value = []
        return
    }

    isLoading.value = true
    try {
        const response = await Api.get('/v1/tags/search?q=' + query) as Tag[]
        availableTags.value = response || []
    } catch (error) {
        availableTags.value = []
    } finally {
        isLoading.value = false
    }
}

let debounceTimer: NodeJS.Timeout | null = null

function handleInput() {
    selectedSuggestionIndex.value = -1
    showSuggestions.value = true

    // Clear previous debounce timer
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    // Debounced API call
    debounceTimer = setTimeout(() => {
        fetchTags(inputValue.value)
    }, 300)
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        event.preventDefault()

        if (selectedSuggestionIndex.value >= 0 && filteredSuggestions.value[selectedSuggestionIndex.value]) {
            // Select existing suggestion
            selectSuggestion(filteredSuggestions.value[selectedSuggestionIndex.value]!)
        } else if (selectedSuggestionIndex.value === filteredSuggestions.value.length && inputValue.value.trim()) {
            // Selected "Create new tag" option
            addNewTag(inputValue.value.trim())
        } else if (inputValue.value.trim()) {
            // No selection, create new tag
            addNewTag(inputValue.value.trim())
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        const maxIndex = filteredSuggestions.value.length + (canCreateNewTag.value ? 0 : -1)
        selectedSuggestionIndex.value = Math.min(selectedSuggestionIndex.value + 1, maxIndex)
    } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
    } else if (event.key === 'Escape') {
        showSuggestions.value = false
        selectedSuggestionIndex.value = -1
    } else if (event.key === 'Backspace' && !inputValue.value && selectedTags.value.length > 0) {
        // Remove last tag when backspacing on empty input
        selectedTags.value.pop()
    }
}

function selectSuggestion(tag: Tag) {
    if (selectedTags.value.length >= props.maxTags) return

    selectedTags.value.push(tag)
    inputValue.value = ''
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
}

function addNewTag(name: string) {
    if (selectedTags.value.length >= props.maxTags) return
    if (selectedTags.value.some(tag => tag.name.toLowerCase() === name.toLowerCase())) return

    const newTag: Tag = {
        id: '',
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
    }

    selectedTags.value.push(newTag)
    inputValue.value = ''
    showSuggestions.value = false

    emit('update:modelValue', selectedTags.value.map(tag => tag.name))
}

function removeTag(tagToRemove: Tag) {
    selectedTags.value = selectedTags.value.filter(tag => tag.name !== tagToRemove.name)

    emit('update:modelValue', selectedTags.value.map(tag => tag.name))
}

// Cleanup timers on unmount
onBeforeUnmount(() => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
})

// Close suggestions when clicking outside
onMounted(() => {
    document.addEventListener('click', () => {
        showSuggestions.value = false
    })
})
</script>
