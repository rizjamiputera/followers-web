<template>
    <div class="form-control w-full">
        <label v-if="label" class="label"><span class="label-text">{{ label }}</span></label>

        <div class="space-y-2">
            <div class="relative">
                <input v-model="query" @input="onInput" @focus="showSuggestions = true" @keydown="onKeyDown"
                    :placeholder="placeholder" class="input input-bordered w-full" type="text" />

                <div v-if="showSuggestions && query.trim()"
                    class="absolute top-full left-0 right-0 z-50 bg-base-100 shadow-lg border border-green-main/20 rounded-lg max-h-56 overflow-y-auto mt-1">

                    <div v-if="isLoading" class="px-4 py-2 text-center text-gray-500 text-sm">Mencari...</div>

                    <div v-for="(sp, index) in suggestions" :key="sp.id" @mousedown.prevent="selectExisting(sp)"
                        class="px-4 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-2"
                        :class="{ 'bg-base-200': index === activeIndex }">
                        <div class="w-6 h-6 rounded-full bg-green-main/10 flex items-center justify-center text-xs font-bold text-green-main shrink-0">
                            {{ sp.name.charAt(0).toUpperCase() }}
                        </div>
                        <span class="font-medium">
                            <span v-if="sp.honorific" class="font-normal text-gray-500">{{ sp.honorific }}&nbsp;</span>{{ sp.name }}
                        </span>
                        <span v-if="sp.credentials" class="text-xs text-gray-400">{{ sp.credentials }}</span>
                    </div>

                    <div v-if="!isLoading && canCreateNew" @mousedown.prevent="createNew"
                        class="px-4 py-2 hover:bg-base-200 cursor-pointer border-t border-base-300"
                        :class="{ 'bg-base-200': activeIndex === suggestions.length }">
                        <span class="font-medium">Buat pemateri baru: "{{ query.trim() }}"</span>
                        <span class="text-xs text-gray-500 ml-2">(nama saja — lengkapi gelar via Manajemen Pemateri)</span>
                    </div>

                    <div v-if="!isLoading && suggestions.length === 0 && !canCreateNew"
                        class="px-4 py-2 text-center text-gray-500 text-sm">Tidak ada hasil</div>
                </div>
            </div>

            <!-- Selected chips -->
            <div v-if="selected.length > 0" class="flex flex-wrap gap-2">
                <div v-for="(sp, i) in selected" :key="sp.speakerId || sp.name + i"
                    class="badge badge-lg gap-2 py-3"
                    :class="sp.speakerId ? 'badge-success badge-outline' : 'badge-warning badge-outline'">
                    <span>
                        <span v-if="sp.honorific" class="opacity-70">{{ sp.honorific }}&nbsp;</span>{{ sp.name }}
                        <span v-if="!sp.speakerId" class="text-xs opacity-60"> (baru)</span>
                    </span>
                    <button @click="remove(i)" class="btn btn-xs btn-circle btn-ghost" type="button">✕</button>
                </div>
            </div>
        </div>

        <p v-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import type { Paginate } from '~/interfaces/app-interface'
import type { Speaker, SelectedSpeaker } from '~/interfaces/speaker-interface'

const props = withDefaults(defineProps<{
    modelValue?: SelectedSpeaker[]
    label?: string
    placeholder?: string
    hint?: string
}>(), {
    placeholder: 'Ketik nama pemateri...',
})

const emit = defineEmits<{ 'update:modelValue': [value: SelectedSpeaker[]] }>()

const selected = ref<SelectedSpeaker[]>([])
const query = ref('')
const suggestions = ref<Speaker[]>([])
const showSuggestions = ref(false)
const isLoading = ref(false)
const activeIndex = ref(-1)

// Sync inbound modelValue (edit mode seeding) without clobbering local edits.
watch(() => props.modelValue, (val) => {
    if (val && val !== selected.value) selected.value = [...val]
}, { immediate: true })

const canCreateNew = computed(() => {
    const t = query.value.trim().toLowerCase()
    if (!t) return false
    if (selected.value.some(s => s.name.toLowerCase() === t)) return false
    if (suggestions.value.some(s => s.name.toLowerCase() === t)) return false
    return true
})

let debounce: NodeJS.Timeout | null = null
function onInput() {
    activeIndex.value = -1
    showSuggestions.value = true
    if (debounce) clearTimeout(debounce)
    debounce = setTimeout(fetchSpeakers, 300)
}

async function fetchSpeakers() {
    const q = query.value.trim()
    if (!q) { suggestions.value = []; return }
    isLoading.value = true
    try {
        const res = await Api.get(`/v1/speakers?search=${encodeURIComponent(q)}&limit=8`) as Paginate<Speaker[]>
        const chosenIds = new Set(selected.value.map(s => s.speakerId).filter(Boolean))
        suggestions.value = (res?.data ?? []).filter(s => !chosenIds.has(s.id))
    } catch {
        suggestions.value = []
    } finally {
        isLoading.value = false
    }
}

function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - (canCreateNew.value ? 0 : 1))
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        activeIndex.value = Math.max(activeIndex.value - 1, -1)
    } else if (e.key === 'Enter') {
        e.preventDefault()
        if (activeIndex.value >= 0 && activeIndex.value < suggestions.value.length) {
            selectExisting(suggestions.value[activeIndex.value]!)
        } else if (canCreateNew.value) {
            createNew()
        }
    } else if (e.key === 'Escape') {
        showSuggestions.value = false
    } else if (e.key === 'Backspace' && !query.value && selected.value.length) {
        remove(selected.value.length - 1)
    }
}

function commit() {
    emit('update:modelValue', selected.value)
}

function selectExisting(sp: Speaker) {
    if (selected.value.some(s => s.speakerId === sp.id)) return
    selected.value.push({
        speakerId: sp.id,
        name: sp.name,
        honorific: sp.honorific,
        credentials: sp.credentials,
        suffix: sp.suffix,
    })
    reset()
    commit()
}

function createNew() {
    const name = query.value.trim()
    if (!name) return
    if (selected.value.some(s => s.name.toLowerCase() === name.toLowerCase())) return
    selected.value.push({ name })
    reset()
    commit()
}

function remove(i: number) {
    selected.value.splice(i, 1)
    commit()
}

function reset() {
    query.value = ''
    suggestions.value = []
    showSuggestions.value = false
    activeIndex.value = -1
}

onBeforeUnmount(() => { if (debounce) clearTimeout(debounce) })
onMounted(() => {
    document.addEventListener('click', () => { showSuggestions.value = false })
})
</script>
