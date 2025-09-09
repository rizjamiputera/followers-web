<template>
    <div class="space-y-6">
        <!-- Registration Configuration Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <LucideUsers class="h-5 w-5 text-green-600" />
                <h3 class="text-lg font-semibold text-gray-900">Event Registration</h3>
            </div>
            <div class="form-control">
                <label class="cursor-pointer label">
                    <input type="checkbox" v-model="configData.isEnabled" class="toggle toggle-success"
                        @change="onToggleRegistration" />
                    <span class="label-text ml-2">{{ configData.isEnabled ? 'Enabled' : 'Disabled' }}</span>
                </label>
            </div>
        </div>

        <div v-if="configData.isEnabled" class="space-y-6">
            <!-- Registration Label -->
            <div class="form-control flex flex-col">
                <label class="label">
                    <span class="label-text font-medium">Registration Label</span>
                </label>
                <input type="text" v-model="configData.label" placeholder="e.g. Registrasi, Daftar Hadir, Registration"
                    class="input input-bordered" />
                <div class="label">
                    <span class="label-text-alt text-sm">This will be shown as the registration form title</span>
                </div>
            </div>

            <!-- Registration Settings -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Participant Limit -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-medium">Limit Peserta</span>
                    </label>
                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="hasParticipantLimit" class="checkbox checkbox-success"
                            @change="toggleParticipantLimit" />
                        <span class="text-sm">Set limit</span>
                        <input v-if="hasParticipantLimit" type="number" v-model.number="configData.participantLimit"
                            placeholder="e.g. 50" min="1" class="input input-bordered input-sm flex-1 max-w-24" />
                    </div>
                    <div class="label">
                        <span class="label-text-alt">
                            {{
                                hasParticipantLimit
                                    ? 'Jumlah maksimal peserta'
                                    : 'Unlimited'
                            }}
                        </span>
                    </div>
                </div>

                <!-- Manual Approval -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-medium">Registration Approval</span>
                    </label>
                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="configData.requireApproval" class="checkbox checkbox-success" />
                        <span class="text-sm">Manual approval</span>
                    </div>
                    <div class="label">
                        <span class="label-text-alt">
                            {{ configData.requireApproval
                                ? 'Admin harus approve tiap registrasi'
                                : 'Auto approve'
                            }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Registration Period -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-medium">Registration Start</span>
                    </label>
                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="hasRegistrationStart" class="checkbox checkbox-success"
                            @change="toggleRegistrationStart" />
                        <span class="text-sm">Set start date</span>
                    </div>
                    <input v-if="hasRegistrationStart" type="datetime-local" v-model="configData.registrationStart"
                        class="input input-bordered input-sm" />
                    <div v-else class="label">
                        <span class="label-text-alt">Opens immediately when event is published</span>
                    </div>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-medium">Registration End</span>
                    </label>
                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="hasRegistrationEnd" class="checkbox checkbox-success"
                            @change="toggleRegistrationEnd" />
                        <span class="text-sm">Set end date</span>
                    </div>
                    <input v-if="hasRegistrationEnd" type="datetime-local" v-model="configData.registrationEnd"
                        class="input input-bordered input-sm" />
                    <div v-else class="label">
                        <span class="label-text-alt">Open until event starts</span>
                    </div>
                </div>
            </div>

            <!-- Confirmation Message -->
            <div class="form-control flex flex-col gap-1">
                <label class="label">
                    <span class="label-text font-medium">Pesan konfirmasi</span>
                </label>
                <textarea v-model="configData.confirmationMessage" class="textarea textarea-bordered"
                    placeholder="Thank you for registering! We'll send you more details soon..." rows="3"></textarea>
                <div class="label">
                    <span class="label-text-alt text-sm">Pesan akan muncul setelah user berhasil melakukan
                        registrasi</span>
                </div>
            </div>

            <!-- Form Fields Configuration -->
            <div class="border-t pt-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-md font-semibold text-gray-900">Registration Form</h4>
                    <Button @click="addFormField" class="btn-sm btn-outline btn-success">
                        <LucidePlus class="h-4 w-4 mr-1" />
                        Add Field
                    </Button>
                </div>

                <div v-if="configData.formFields.length === 0" class="text-center py-8 text-gray-500">
                    No form fields configured. Add fields to collect information from participants.
                </div>

                <div v-else class="space-y-4">
                    <div v-for="(field, index) in configData.formFields" :key="field.key || index"
                        class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <LucideGripVertical class="h-4 w-4 text-gray-400 cursor-move" />
                                <span class="font-medium">Field {{ index + 1 }}</span>
                            </div>
                            <button type="button" @click="removeFormField(index)"
                                class="btn btn-xs btn-error btn-outline">
                                <LucideTrash class="h-3 w-3" />
                            </button>
                        </div>

                        <!-- Required -->
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-sm">Required</span>
                            </label>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" v-model="field.required"
                                    class="checkbox checkbox-success checkbox-sm" />
                                <span class="text-sm">Required field</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <!-- Field Label -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-sm">Field Label</span>
                                </label>
                                <input type="text" v-model="field.label" placeholder="e.g. Phone Number"
                                    class="input input-bordered input-sm"
                                    @blur="updateFieldKeyFromLabel(field, field.label)" />
                            </div>
                            <!-- Field Key -->
                            <div class="form-control opacity-0">
                                <label class="label">
                                    <span class="label-text text-sm">Field Key <span
                                            class="text-xs text-gray-500">(auto-generated from label)</span></span>
                                </label>
                                <div class="relative">
                                    <input type="text" v-model="field.key" placeholder="e.g. phone_number"
                                        class="input input-bordered input-sm bg-gray-50 pr-8" disabled readonly />
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <LucideKey class="h-3 w-3 text-gray-400" />
                                    </div>
                                </div>
                                <div class="label">
                                    <span class="label-text-alt text-xs">This key will be used to store form data</span>
                                </div>
                            </div>

                            <!-- Field Type -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-sm">Field Type</span>
                                </label>
                                <select v-model="field.type" class="select select-bordered select-sm">
                                    <option value="TEXT">Text</option>
                                    <option value="EMAIL">Email</option>
                                    <option value="PHONE">Phone</option>
                                    <option value="NUMBER">Number</option>
                                    <option value="TEXTAREA">Textarea</option>
                                    <option value="SELECT">Dropdown</option>
                                    <option value="RADIO">Radio Buttons</option>
                                    <option value="CHECKBOX">Checkboxes</option>
                                    <option value="DATE">Date</option>
                                </select>
                            </div>

                            <!-- Placeholder -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-sm">Placeholder</span>
                                </label>
                                <input type="text" v-model="field.placeholder"
                                    placeholder="e.g. Enter your phone number" class="input input-bordered input-sm" />
                            </div>

                            <!-- Help Text -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-sm">Help Text</span>
                                </label>
                                <input type="text" v-model="field.helpText"
                                    placeholder="Additional instructions for users"
                                    class="input input-bordered input-sm" />
                            </div>
                        </div>

                        <!-- Options for SELECT, RADIO, CHECKBOX -->
                        <div v-if="['SELECT', 'RADIO', 'CHECKBOX'].includes(field.type)" class="mt-4">
                            <label class="label">
                                <span class="label-text text-sm">Options</span>
                            </label>
                            <div class="space-y-2">
                                <div v-for="(option, optionIndex) in (field.options || [])" :key="optionIndex"
                                    class="flex items-center gap-2">
                                    <input type="text" v-model="field.options![optionIndex]" placeholder="Option text"
                                        class="input input-bordered input-sm flex-1" />
                                    <button type="button" @click="removeOption(field, optionIndex)"
                                        class="btn btn-xs btn-error btn-outline">
                                        <LucideX class="h-3 w-3" />
                                    </button>
                                </div>
                                <button type="button" @click="addOption(field)" class="btn btn-xs btn-outline">
                                    <LucidePlus class="h-3 w-3 mr-1" />
                                    Add Option
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Registration Status (if event has registrations) -->
            <div v-if="currentRegistrations && currentRegistrations.length > 0" class="border-t pt-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-md font-semibold text-gray-900">Current Registrations</h4>
                    <div class="flex gap-2">
                        <div class="stat">
                            <div class="stat-value text-lg text-success">{{ confirmedCount }}</div>
                            <div class="stat-title text-xs">Confirmed</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value text-lg text-warning">{{ pendingCount }}</div>
                            <div class="stat-title text-xs">Pending</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    LucideUsers, LucidePlus, LucideGripVertical, LucideTrash, LucideX, LucideKey
} from 'lucide-vue-next'
import type {
    EventRegistrationConfig,
    FormField,
    FormFieldType,
    EventRegistration
} from '~/interfaces/event-registration-interface'

interface Props {
    eventId?: string
    initialConfig?: EventRegistrationConfig
    currentRegistrations?: EventRegistration[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:config': [config: any]
    'save': [config: any]
}>()

// Reactive data
const configData = ref<{
    isEnabled: boolean
    label: string
    participantLimit?: number | null
    registrationStart?: string
    registrationEnd?: string
    formFields: FormField[]
    requireApproval: boolean
    confirmationMessage?: string
}>({
    isEnabled: false,
    label: 'Registrasi',
    participantLimit: null,
    registrationStart: undefined,
    registrationEnd: undefined,
    formFields: [],
    requireApproval: false,
    confirmationMessage: ''
})

const hasParticipantLimit = ref(false)
const hasRegistrationStart = ref(false)
const hasRegistrationEnd = ref(false)

// Utility functions
const formatDateForInput = (date: Date): string => {
    // Format date for datetime-local input while preserving user's local timezone
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '_') // Replace spaces, underscores, hyphens with single underscore
        .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
}

const generateUniqueFieldKey = (baseKey: string, excludeKeys?: string[]): string => {
    const slugified = slugify(baseKey) || 'field'
    const existingKeys = excludeKeys || configData.value.formFields.map(field => field.key)

    if (!existingKeys.includes(slugified)) {
        return slugified
    }

    // If key exists, append a number
    let counter = 1
    let uniqueKey = `${slugified}_${counter}`

    while (existingKeys.includes(uniqueKey)) {
        counter++
        uniqueKey = `${slugified}_${counter}`
    }

    return uniqueKey
}

const ensureUniqueFieldKeys = (fields: FormField[]) => {
    const updatedFields = []
    const usedKeys = new Set<string>()

    for (const field of fields) {
        let fieldKey = field.key

        // If key is empty or already used, generate a new one
        if (!fieldKey || usedKeys.has(fieldKey)) {
            fieldKey = generateUniqueFieldKey(field.label || 'field', Array.from(usedKeys))
        }

        usedKeys.add(fieldKey)
        updatedFields.push({
            ...field,
            key: fieldKey
        })
    }

    return updatedFields
}

// Initialize with existing config
watchEffect(() => {
    if (props.initialConfig) {
        const formFields = ensureUniqueFieldKeys([...props.initialConfig.formFields])

        configData.value = {
            isEnabled: props.initialConfig.isEnabled,
            label: props.initialConfig.label || 'Registrasi',
            participantLimit: props.initialConfig.participantLimit,
            registrationStart: props.initialConfig.registrationStart ?
                formatDateForInput(new Date(props.initialConfig.registrationStart)) : undefined,
            registrationEnd: props.initialConfig.registrationEnd ?
                formatDateForInput(new Date(props.initialConfig.registrationEnd)) : undefined,
            formFields: formFields,
            requireApproval: props.initialConfig.requireApproval || false,
            confirmationMessage: props.initialConfig.confirmationMessage || ''
        }

        hasParticipantLimit.value = !!props.initialConfig.participantLimit
        hasRegistrationStart.value = !!props.initialConfig.registrationStart
        hasRegistrationEnd.value = !!props.initialConfig.registrationEnd
    }
})

// Computed values
const confirmedCount = computed(() => {
    return props.currentRegistrations?.filter(r => r.status === 'CONFIRMED').length || 0
})

const pendingCount = computed(() => {
    return props.currentRegistrations?.filter(r => r.status === 'PENDING').length || 0
})

const updateFieldKeyFromLabel = (field: FormField, newLabel: string) => {
    if (!newLabel.trim()) return

    const excludeKeys = configData.value.formFields
        .filter(f => f !== field) // exclude current field
        .map(f => f.key)


    const newKey = generateUniqueFieldKey(newLabel, excludeKeys)
    field.key = newKey
    emitUpdate()
}

// Methods
const onToggleRegistration = () => {
    if (!configData.value.isEnabled) {
        // Reset form when disabled
        configData.value.formFields = []
        hasParticipantLimit.value = false
        hasRegistrationStart.value = false
        hasRegistrationEnd.value = false
    }
    emitUpdate()
}

const toggleParticipantLimit = () => {
    if (!hasParticipantLimit.value) {
        configData.value.participantLimit = null
    } else {
        configData.value.participantLimit = 50
    }
    emitUpdate()
}

const toggleRegistrationStart = () => {
    if (!hasRegistrationStart.value) {
        configData.value.registrationStart = undefined
    }
    emitUpdate()
}

const toggleRegistrationEnd = () => {
    if (!hasRegistrationEnd.value) {
        configData.value.registrationEnd = undefined
    }
    emitUpdate()
}

const addFormField = () => {
    const fieldNumber = configData.value.formFields.length + 1
    const defaultLabel = `Field ${fieldNumber}`

    const newField: FormField = {
        key: generateUniqueFieldKey(defaultLabel),
        label: defaultLabel,
        type: 'TEXT' as FormFieldType,
        required: false,
        placeholder: '',
        helpText: '',
        options: []
    }

    configData.value.formFields.push(newField)
    emitUpdate()
}

const removeFormField = (index: number) => {
    configData.value.formFields.splice(index, 1)
    emitUpdate()
}

const addOption = (field: FormField) => {
    if (!field.options) {
        field.options = []
    }
    field.options.push('New Option')
    emitUpdate()
}

const removeOption = (field: FormField, index: number) => {
    field.options?.splice(index, 1)
    emitUpdate()
}

const emitUpdate = () => {
    // Convert datetime-local values to ISO strings with timezone information
    const configToEmit = {
        ...configData.value,
        registrationStart: configData.value.registrationStart 
            ? new Date(configData.value.registrationStart).toISOString() 
            : undefined,
        registrationEnd: configData.value.registrationEnd 
            ? new Date(configData.value.registrationEnd).toISOString() 
            : undefined,
    }
    
    emit('update:config', configToEmit)
}

// Watch for changes and emit updates
watch(configData, () => {
    emitUpdate()
}, { deep: true })
</script>
