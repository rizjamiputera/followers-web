import { defineStore } from 'pinia'
import type {
    EventRegistrationConfig,
    EventRegistration,
    RegistrationFormData,
    RegistrationStatus,
    CancelRegistrationData
} from '~/interfaces/event-registration-interface'

interface EventRegistrationState {
    config?: EventRegistrationConfig
    userRegistration?: EventRegistration | null
    registeredCount: number
    availableSpots?: number | null
    isLoading: boolean
    isSubmitting: boolean
    error?: string
    successMessage?: string
}

export const useEventRegistrationStore = defineStore('event-registration', {
    state: (): EventRegistrationState => ({
        config: undefined,
        userRegistration: null,
        registeredCount: 0,
        availableSpots: null,
        isLoading: false,
        isSubmitting: false,
        error: undefined,
        successMessage: undefined
    }),

    getters: {
        isRegistrationEnabled: (state) => state.config?.isEnabled ?? false,

        isRegistrationOpen: (state): boolean => {
            if (!state.config?.isEnabled) return false

            const now = new Date()
            const startDate = state.config.registrationStart ? new Date(state.config.registrationStart) : null
            const endDate = state.config.registrationEnd ? new Date(state.config.registrationEnd) : null

            const hasStarted = !startDate || now >= startDate
            const hasEnded = endDate && now >= endDate

            return hasStarted && !hasEnded
        },

        isRegistrationFull: (state) => {
            if (!state.config?.participantLimit) return false
            return state.registeredCount >= state.config.participantLimit
        },

        canRegister(): boolean {
            return this.isRegistrationOpen && !this.isRegistrationFull && !this.userRegistration
        },

        canUpdateRegistration(): boolean {
            if (!this.userRegistration || this.userRegistration.status === 'CANCELLED') return false
            return this.isRegistrationOpen
        },

        registrationStatusText: (state) => {
            if (!state.userRegistration) return null

            switch (state.userRegistration.status) {
                case 'PENDING':
                    return 'Your registration is pending approval'
                case 'CONFIRMED':
                    return 'You are registered for this event'
                case 'CANCELLED':
                    return 'Your registration has been cancelled'
                default:
                    return null
            }
        }
    },

    actions: {
        // Load registration config for an event
        async loadRegistrationConfig(eventId: string) {
            this.isLoading = true
            this.error = undefined

            try {
                const data = await Api.get(`/v1/event/${eventId}/registration-config`) as EventRegistrationConfig
                this.config = data

                // Calculate available spots
                if (data.participantLimit) {
                    this.availableSpots = Math.max(0, data.participantLimit - this.registeredCount)
                } else {
                    this.availableSpots = null
                }
            } catch (error: any) {
                if (error.status !== 404) {
                    this.error = 'Failed to load registration information'
                }
                this.config = undefined
            } finally {
                this.isLoading = false
            }
        },

        // Load user's registration for an event
        async loadUserRegistration(eventId: string) {
            const authStore = useAuthStore()
            if (!authStore.user) {
                this.userRegistration = null
                return
            }

            try {
                // This would need to be implemented on the backend - a way to get user's registration for a specific event
                // For now, we'll get it from the event data that includes user registration
                // This is handled in the event page component
            } catch (error) {
                console.error('Error loading user registration:', error)
                this.userRegistration = null
            }
        },

        // Register for an event
        async register(eventId: string, formData: Record<string, any>) {
            const authStore = useAuthStore()
            if (!authStore.user) {
                authStore.show_request_login = true
                return false
            }

            this.isSubmitting = true
            this.error = undefined
            this.successMessage = undefined

            try {
                const registrationData: RegistrationFormData = { formData }
                const response = await Api.post(`/v1/event/${eventId}/register`, registrationData) as EventRegistration

                this.userRegistration = response
                this.registeredCount += 1

                if (this.config?.participantLimit) {
                    this.availableSpots = Math.max(0, this.config.participantLimit - this.registeredCount)
                }

                this.successMessage = this.config?.confirmationMessage || 'Registration successful!'
                return true
            } catch (error: any) {
                this.error = error.data?.message || 'Failed to register for event'
                return false
            } finally {
                this.isSubmitting = false
            }
        },

        // Update registration
        async updateRegistration(registrationId: string, formData: Record<string, any>) {
            this.isSubmitting = true
            this.error = undefined
            this.successMessage = undefined

            try {
                const updateData = { formData }
                const response = await Api.patch(`/v1/event/registration/${registrationId}`, updateData) as EventRegistration

                this.userRegistration = response
                this.successMessage = 'Registration updated successfully!'
                return true
            } catch (error: any) {
                this.error = error.data?.message || 'Failed to update registration'
                return false
            } finally {
                this.isSubmitting = false
            }
        },

        // Cancel registration
        async cancelRegistration(registrationId: string, reason?: string) {
            this.isSubmitting = true
            this.error = undefined
            this.successMessage = undefined

            try {
                const cancelData: CancelRegistrationData = {}
                if (reason) {
                    cancelData.cancellationNote = reason
                }

                await Api.remove(`/v1/event/registration/${registrationId}`, cancelData)

                if (this.userRegistration) {
                    this.userRegistration.status = 'CANCELLED' as RegistrationStatus
                    this.userRegistration.cancelledAt = new Date().toISOString()
                    this.userRegistration.cancellationNote = reason || null
                }

                this.registeredCount = Math.max(0, this.registeredCount - 1)

                if (this.config?.participantLimit) {
                    this.availableSpots = Math.max(0, this.config.participantLimit - this.registeredCount)
                }

                this.successMessage = 'Registration cancelled successfully'
                return true
            } catch (error: any) {
                this.error = error.data?.message || 'Failed to cancel registration'
                return false
            } finally {
                this.isSubmitting = false
            }
        },

        // Set registration data from event data (for initial load)
        setRegistrationData(data: {
            config?: EventRegistrationConfig
            userRegistration?: EventRegistration | null
            registeredCount?: number
        }) {
            this.config = data.config
            this.userRegistration = data.userRegistration || null
            this.registeredCount = data.registeredCount || 0

            if (this.config?.participantLimit) {
                this.availableSpots = Math.max(0, this.config.participantLimit - this.registeredCount)
            } else {
                this.availableSpots = null
            }
        },

        // Clear messages
        clearMessages() {
            this.error = undefined
            this.successMessage = undefined
        },

        // Reset store
        reset() {
            this.$reset()
        }
    }
})
