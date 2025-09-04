export enum FormFieldType {
    TEXT = 'TEXT',
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    NUMBER = 'NUMBER',
    TEXTAREA = 'TEXTAREA',
    SELECT = 'SELECT',
    CHECKBOX = 'CHECKBOX',
    RADIO = 'RADIO',
    DATE = 'DATE',
}

export enum RegistrationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

export interface FormField {
    key: string
    label: string
    type: FormFieldType
    required?: boolean
    placeholder?: string
    helpText?: string
    options?: string[]
    validation?: Record<string, any>
}

export interface EventRegistrationConfig {
    id: string
    eventId: string
    isEnabled: boolean
    participantLimit?: number | null
    registrationStart?: string | null
    registrationEnd?: string | null
    formFields: FormField[]
    requireApproval?: boolean
    confirmationMessage?: string | null
    createdAt: string
    updatedAt: string
}

export interface EventRegistration {
    id: string
    eventId: string
    userId: string
    formData: Record<string, any>
    status: RegistrationStatus
    registeredAt: string
    confirmedAt?: string | null
    cancelledAt?: string | null
    cancellationNote?: string | null
    createdAt: string
    updatedAt: string
    user?: {
        id: string
        name: string
        email: string
        avatar_md?: string
    }
    event?: {
        id: string
        title: string
        slug: string
        start_at: string
        location?: string
        image?: string
    }
}

export interface RegistrationFormData {
    formData: Record<string, any>
}

export interface CreateRegistrationConfigData {
    isEnabled: boolean
    participantLimit?: number | null
    registrationStart?: string
    registrationEnd?: string
    formFields: FormField[]
    requireApproval?: boolean
    confirmationMessage?: string
}

export interface UpdateRegistrationConfigData extends Partial<CreateRegistrationConfigData> { }

export interface UpdateRegistrationData {
    formData?: Record<string, any>
}

export interface ConfirmRegistrationData {
    note?: string
}

export interface CancelRegistrationData {
    cancellationNote?: string
}

export interface RegistrationFilterParams {
    status?: RegistrationStatus
    search?: string
    page?: number
    limit?: number
}

// Event interface extension to include registration data
export interface EventWithRegistration {
    registrationConfig?: EventRegistrationConfig
    userRegistration?: EventRegistration | null
    registeredCount?: number
    availableSpots?: number | null
}

// Form validation result
export interface FormValidationResult {
    isValid: boolean
    errors: Record<string, string>
}

// Registration form submission result
export interface RegistrationResult {
    success: boolean
    message: string
    registration?: EventRegistration
}
