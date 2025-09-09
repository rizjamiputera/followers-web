<template>
    <Modal :show="_show" @close="emit('close')">
        <h3 class="text-xl font-semibold">Export Options</h3>
        <!-- Step 1: Choose Data -->
        <div v-if="exportStep === 1">
            <p class="text-gray-600 mb-4">Choose which registrations to export:</p>

            <div class="space-y-3">
                <button @click="selectedExportType = 'all'"
                    :class="selectedExportType === 'all' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'"
                    class="w-full p-4 border rounded-lg transition-colors text-left cursor-pointer">
                    <div class="flex items-center gap-3">
                        <LucideUsers class="h-5 w-5"
                            :class="selectedExportType === 'all' ? 'text-green-600' : 'text-gray-600'" />
                        <div>
                            <div class="font-medium">All Registrations</div>
                            <div class="text-sm text-gray-500">
                                Export all registrations ({{ totalCount }} total)
                            </div>
                        </div>
                        <div class="ml-auto">
                            <div v-if="selectedExportType === 'all'"
                                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                <LucideCheck class="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                </button>

                <button @click="selectedExportType = 'confirmed'"
                    :class="selectedExportType === 'confirmed' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'"
                    class="w-full p-4 border rounded-lg transition-colors text-left cursor-pointer">
                    <div class="flex items-center gap-3">
                        <LucideUserCheck class="h-5 w-5"
                            :class="selectedExportType === 'confirmed' ? 'text-green-600' : 'text-green-600'" />
                        <div>
                            <div class="font-medium">Confirmed Only</div>
                            <div class="text-sm text-gray-500">
                                Export only confirmed ({{ confirmedCount }} total)
                            </div>
                        </div>
                        <div class="ml-auto">
                            <div v-if="selectedExportType === 'confirmed'"
                                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                <LucideCheck class="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <div class="flex justify-end mt-6">
                <button @click="exportStep = 2" :disabled="!selectedExportType" class="btn btn-primary"
                    :class="{ 'btn-disabled': !selectedExportType }">
                    Next: Choose Format
                    <LucideChevronRight class="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>

        <!-- Step 2: Choose Format -->
        <div v-if="exportStep === 2">
            <div class="flex items-center gap-2 mb-4">
                <button @click="exportStep = 1" class="btn btn-sm btn-circle btn-ghost">
                    <LucideChevronLeft class="w-4 h-4" />
                </button>
                <p class="text-gray-600">Choose export format:</p>
            </div>

            <div class="space-y-3">
                <button @click="selectedExportFormat = 'pdf'"
                    :class="selectedExportFormat === 'pdf' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'"
                    class="w-full p-4 border rounded-lg transition-colors text-left cursor-pointer">
                    <div class="flex items-center gap-3">
                        <LucideFileText class="h-5 w-5"
                            :class="selectedExportFormat === 'pdf' ? 'text-red-600' : 'text-red-500'" />
                        <div>
                            <div class="font-medium">PDF Format</div>
                            <div class="text-sm text-gray-500">Professional document with formatted
                                layout</div>
                        </div>
                        <div class="ml-auto">
                            <div v-if="selectedExportFormat === 'pdf'"
                                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                <LucideCheck class="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                </button>

                <button @click="selectedExportFormat = 'xlsx'"
                    :class="selectedExportFormat === 'xlsx' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'"
                    class="w-full p-4 border rounded-lg transition-colors text-left cursor-pointer">
                    <div class="flex items-center gap-3">
                        <LucideSheet class="h-5 w-5"
                            :class="selectedExportFormat === 'xlsx' ? 'text-green-600' : 'text-green-500'" />
                        <div>
                            <div class="font-medium">Excel Format (XLSX)</div>
                            <div class="text-sm text-gray-500">Spreadsheet format for data analysis
                            </div>
                        </div>
                        <div class="ml-auto">
                            <div v-if="selectedExportFormat === 'xlsx'"
                                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                <LucideCheck class="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <div class="flex justify-between mt-6">
                <button @click="exportStep = 1" class="btn btn-outline">
                    <LucideChevronLeft class="w-4 h-4 mr-1" />
                    Back
                </button>
                <button @click="exportWithFormatAndFilter()" :disabled="!selectedExportFormat || isExporting"
                    class="btn btn-success" :class="{ 'btn-disabled': !selectedExportFormat }">
                    <LucideDownload class="w-4 h-4 mr-1" />
                    Export {{ selectedExportFormat?.toUpperCase() }}
                </button>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { LucideCheck, LucideChevronLeft, LucideChevronRight, LucideDownload, LucideFileText, LucideSheet, LucideUserCheck, LucideUsers } from 'lucide-vue-next';

// const emit = defineEmits(['close', 'export']);
const emit = defineEmits<{
    close: []
    export: [exportType: 'all' | 'confirmed', format: 'pdf' | 'xlsx']
}>()
const props = defineProps<{
    show: boolean
    isExporting: boolean
    totalCount: number
    confirmedCount: number
}>()

const _show = ref<boolean>(false);

watchEffect(() => {
    _show.value = props.show;
})

const exportStep = ref(1)
const selectedExportType = ref<'all' | 'confirmed' | null>(null)
const selectedExportFormat = ref<'pdf' | 'xlsx' | null>(null)

const exportWithFormatAndFilter = () => {
    if (!selectedExportType.value || !selectedExportFormat.value) return

    emit('export', selectedExportType.value, selectedExportFormat.value)
}

onMounted(() => {
    exportStep.value = 1
    selectedExportType.value = null
    selectedExportFormat.value = null
});

onUnmounted(() => {
    exportStep.value = 1
    selectedExportType.value = null
    selectedExportFormat.value = null
});
</script>

<style></style>
