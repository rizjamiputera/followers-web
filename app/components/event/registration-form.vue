<template>
    <Modal :show="_show" @close="emit('close')">
        <!-- <div class="space-y-6"> -->
        <!-- <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6"> -->
        <div class="flex items-center gap-2 mb-6">
            <LucideClipboardList class="h-5 w-5 text-green-600" />
            <h3 v-if="formFields.length" class="text-lg font-semibold text-gray-900">Event Registration Form</h3>
            <h3 v-else class="text-lg font-semibold text-gray-900">Registrasi</h3>
        </div>

        <form v-show="!confirmationMessage" @submit.prevent="handleSubmit" class="space-y-6">
            <p class="text-gray-600 mb-4">
                Apakah anda yakin untuk melakukan registrasi?
            </p>
            <!-- Dynamic Form Fields -->
            <div v-for="field in formFields" :key="field.key" class="space-y-2">
                <label :for="field.key" class="block text-sm font-medium text-gray-700">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                </label>

                <!-- Text Input -->
                <input v-if="field.type === 'TEXT' || field.type === 'EMAIL' || field.type === 'PHONE'" :id="field.key"
                    :type="getInputType(field.type)" v-model="formData[field.key]" :placeholder="field.placeholder"
                    :required="field.required" :class="getInputClass(field.key)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />

                <!-- Number Input -->
                <input v-else-if="field.type === 'NUMBER'" :id="field.key" type="number"
                    v-model.number="formData[field.key]" :placeholder="field.placeholder" :required="field.required"
                    :class="getInputClass(field.key)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />

                <!-- Date Input -->
                <input v-else-if="field.type === 'DATE'" :id="field.key" type="date" v-model="formData[field.key]"
                    :required="field.required" :class="getInputClass(field.key)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />

                <!-- Textarea -->
                <textarea v-else-if="field.type === 'TEXTAREA'" :id="field.key" v-model="formData[field.key]"
                    :placeholder="field.placeholder" :required="field.required" rows="4"
                    :class="getInputClass(field.key)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"></textarea>

                <!-- Select Dropdown -->
                <select v-else-if="field.type === 'SELECT'" :id="field.key" v-model="formData[field.key]"
                    :required="field.required" :class="getInputClass(field.key)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="" disabled>Select {{ field.label }}</option>
                    <option v-for="option in field.options" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>

                <!-- Radio Buttons -->
                <div v-else-if="field.type === 'RADIO'" class="space-y-2">
                    <div v-for="option in field.options" :key="option" class="flex items-center">
                        <input :id="`${field.key}_${option}`" :name="field.key" type="radio" :value="option"
                            v-model="formData[field.key]" :required="field.required"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                        <label :for="`${field.key}_${option}`" class="ml-3 text-sm text-gray-700">
                            {{ option }}
                        </label>
                    </div>
                </div>

                <!-- Checkboxes -->
                <div v-else-if="field.type === 'CHECKBOX'" class="space-y-2">
                    <div v-for="option in field.options" :key="option" class="flex items-center">
                        <input :id="`${field.key}_${option}`" type="checkbox" :value="option"
                            v-model="formData[field.key]"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label :for="`${field.key}_${option}`" class="ml-3 text-sm text-gray-700">
                            {{ option }}
                        </label>
                    </div>
                </div>

                <!-- Help Text -->
                <p v-if="field.helpText" class="text-xs text-gray-500">
                    {{ field.helpText }}
                </p>

                <!-- Error Message -->
                <p v-if="errors[field.key]" class="text-xs text-red-600">
                    {{ errors[field.key] }}
                </p>
            </div>

            <!-- Form Actions -->
            <div class="flex gap-3 pt-6 border-t border-gray-200">
                <button type="button" @click="$emit('close')"
                    class="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors">
                    Batal
                </button>
                <button type="submit" :disabled="isSubmitting"
                    class="flex-1 btn btn-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <LucideLoader2 v-if="isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
                    <LucideUserPlus v-else class="h-4 w-4 mr-2" />
                    {{ isUpdating ? 'Update Registrasi' : 'Register / Daftar' }}
                </button>
            </div>
        </form>
        <!-- </div> -->

        <!-- Confirmation Message -->
        <div v-if="confirmationMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div class="flex items-start gap-2">
                <LucideInfo class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p class="text-sm text-green-800">{{ confirmationMessage }}</p>
            </div>
        </div>
        <!-- </div> -->
    </Modal>
</template>

<script lang="ts" setup>
import {
    LucideClipboardList, LucideUserPlus, LucideLoader2, LucideInfo
} from 'lucide-vue-next'
import type { FormField, FormFieldType } from '~/interfaces/event-registration-interface'

interface Props {
    formFields: FormField[]
    initialData?: Record<string, any>
    isUpdating?: boolean
    confirmationMessage?: string
    show: boolean
}

const props = withDefaults(defineProps<Props>(), {
    initialData: () => ({}),
    isUpdating: false
})

const emit = defineEmits<{
    submit: [data: Record<string, any>]
    close: []
}>()

const _show = ref<boolean>(false);

watchEffect(() => {
    _show.value = props.show;
})

// Reactive form data
const formData = ref<Record<string, any>>({})
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Initialize form data
watchEffect(() => {
    const initialFormData: Record<string, any> = {}

    // Initialize with field defaults
    props.formFields.forEach(field => {
        if (field.type === 'CHECKBOX') {
            initialFormData[field.key] = []
        } else {
            initialFormData[field.key] = ''
        }
    })

    // Override with initial data if provided
    Object.assign(initialFormData, props.initialData)

    formData.value = initialFormData
})

// Helper functions
const getInputType = (fieldType: FormFieldType): string => {
    switch (fieldType) {
        case 'EMAIL':
            return 'email'
        case 'PHONE':
            return 'tel'
        case 'TEXT':
        default:
            return 'text'
    }
}

const getInputClass = (fieldKey: string): string => {
    return errors.value[fieldKey] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
}

// Form validation
const validateForm = (): boolean => {
    errors.value = {}
    let isValid = true

    props.formFields.forEach(field => {
        const value = formData.value[field.key]

        // Required field validation
        if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
            errors.value[field.key] = `${field.label} is required`
            isValid = false
            return
        }

        if (!value) return // Skip other validations if not required and empty

        // Type-specific validation
        switch (field.type) {
            case 'EMAIL':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(value)) {
                    errors.value[field.key] = 'Please enter a valid email address'
                    isValid = false
                }
                break

            case 'PHONE':
                const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,15}$/
                if (!phoneRegex.test(value)) {
                    errors.value[field.key] = 'Please enter a valid phone number'
                    isValid = false
                }
                break

            case 'NUMBER':
                if (isNaN(Number(value))) {
                    errors.value[field.key] = 'Please enter a valid number'
                    isValid = false
                }
                break
        }

        // Custom validation rules
        if (field.validation) {
            if (field.validation.minLength && value.length < field.validation.minLength) {
                errors.value[field.key] = `${field.label} must be at least ${field.validation.minLength} characters long`
                isValid = false
            }
            if (field.validation.maxLength && value.length > field.validation.maxLength) {
                errors.value[field.key] = `${field.label} must be at most ${field.validation.maxLength} characters long`
                isValid = false
            }
            if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
                errors.value[field.key] = `${field.label} format is invalid`
                isValid = false
            }
        }
    })

    return isValid
}

// Form submission
const handleSubmit = async () => {
    if (!validateForm()) return

    isSubmitting.value = true
    try {
        emit('submit', formData.value)
    } finally {
        isSubmitting.value = false
    }
}
</script>
