<template>
    <div v-if="registrationConfig" class="card border border-gray-300/50 rounded-2xl">
        <div class="card-body">
            <div class="card-title flex items-center gap-2 mb-4">
                <LucideUsers class="h-5 w-5 text-green-600" />
                <h3 class="text-lg font-semibold text-gray-900">{{ registrationConfig.label ?? 'Registrasi' }}</h3>
            </div>

            <!-- Registration Status -->
            <div class="mb-4">
                <div v-if="!registrationConfig.isEnabled"
                    class="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <LucideX class="h-4 w-4" />
                    <span class="font-medium">Registration is not available for this event</span>
                </div>

                <div v-else-if="!isRegistrationOpen"
                    class="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <LucideClock class="h-4 w-4" />
                    <span class="font-medium">
                        <span v-if="!hasRegistrationStarted">
                            Registrasi dibuka pada {{ formatDate(registrationConfig.registrationStart!) }}
                        </span>
                        <span v-else-if="hasRegistrationEnded">
                            Registrasi ditutup pada {{ formatDate(registrationConfig.registrationEnd!) }}
                        </span>
                    </span>
                </div>

                <div v-else-if="isRegistrationFull"
                    class="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <LucideUserX class="h-4 w-4" />
                    <span class="font-medium">
                        Registrasi sudah penuh ({{ registrationConfig.participantLimit }} kuota)
                    </span>
                </div>

                <div v-else class="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <LucideUserCheck class="h-4 w-4" />
                    <span class="font-medium">Registrasi dibuka</span>
                </div>
            </div>

            <!-- Registration Details -->
            <div class="space-y-3 mb-6">
                <!-- Participant Count -->
                <div v-if="registrationConfig.participantLimit || registeredCount"
                    class="flex justify-between items-center">
                    <span class="text-gray-600">Jumlah peserta</span>
                    <div class="text-right">
                        <span class="font-semibold text-gray-900">{{ registeredCount || 0 }}</span>
                        <span v-if="registrationConfig.participantLimit" class="text-gray-500">
                            / {{ registrationConfig.participantLimit }}
                        </span>
                    </div>
                </div>

                <!-- Available Spots -->
                <div v-if="availableSpots !== null" class="flex justify-between items-center">
                    <span class="text-gray-600">Sisa kuota</span>
                    <span class="font-semibold" :class="availableSpots === 0 ? 'text-red-600' : 'text-green-600'">
                        {{ availableSpots }}
                    </span>
                </div>

                <!-- Registration Period -->
                <div v-if="registrationConfig.registrationStart || registrationConfig.registrationEnd"
                    class="flex justify-between items-center">
                    <span class="text-gray-600">Periode registrasi</span>
                    <div class="text-right text-sm">
                        <div v-if="registrationConfig.registrationStart">
                            Dari: {{ formatDate(registrationConfig.registrationStart) }}
                        </div>
                        <div v-if="registrationConfig.registrationEnd">
                            Sampai: {{ formatDate(registrationConfig.registrationEnd) }}
                        </div>
                    </div>
                </div>

                <!-- Approval Required -->
                <!-- <div v-if="registrationConfig.requireApproval" class="flex justify-between items-center">
                    <span class="text-gray-600">Approval</span>
                    <span class="text-sm font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded">
                        Manual Approval Required
                    </span>
                </div> -->
            </div>

            <!-- User Registration Status -->
            <div v-if="userRegistration" class="mb-6 p-4 rounded-lg border-2" :class="userRegistrationStatusClass">
                <div class="flex items-center gap-2 mb-2">
                    <component :is="userRegistrationIcon" class="h-5 w-5" />
                    <span class="font-semibold">{{ userRegistrationStatusText }}</span>
                </div>
                <p class="text-sm opacity-90">
                    <span v-if="userRegistration.status === 'PENDING'">
                        <!-- Your registration is pending approval. We'll notify you once it's confirmed. -->
                        Registrasi anda sedang di verifikasi oleh admin
                    </span>
                    <span v-else-if="userRegistration.status === 'CONFIRMED'">
                        <!-- You're registered for this event! We'll send you event updates. -->
                        Terima kasih sudah melakukan registrasi
                    </span>
                    <span v-else-if="userRegistration.status === 'CANCELLED'">
                        Your registration was cancelled.
                        <span v-if="userRegistration.cancellationNote"> Reason: {{ userRegistration.cancellationNote
                            }}</span>
                    </span>
                </p>
                <p class="text-xs text-gray-500 mt-2">
                    Register pada {{ formatDate(userRegistration.registeredAt) }}
                </p>
            </div>

            <!-- Action Button -->
            <div class="flex gap-3">
                <!-- Register Button -->
                <button v-if="!userRegistration && canRegister" @click="$emit('register')"
                    class="flex-1 btn btn-primary text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors">
                    <LucideUserPlus class="h-4 w-4 mr-2" />
                    Register / Daftar
                </button>

                <!-- Update Registration Button -->
                <button
                    v-if="userRegistration && userRegistration.status !== 'CANCELLED' && isRegistrationOpen && registrationConfig.formFields.length"
                    @click="$emit('update')"
                    class="flex-1 btn btn-outline border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 rounded-lg transition-colors">
                    <LucideEdit class="h-4 w-4 mr-2" />
                    Update Registrasi
                </button>

                <!-- Cancel Registration Button -->
                <Button v-if="userRegistration && userRegistration.status !== 'CANCELLED'" @click="$emit('cancel')"
                    class="btn-error btn-outline hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition-colors">
                    <LucideUserMinus class="h-4 w-4" /> Batal
                </Button>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import {
    LucideUsers, LucideX, LucideClock, LucideUserX, LucideUserCheck,
    LucideUserPlus, LucideEdit, LucideUserMinus, LucideCheckCircle,
    LucideAlertCircle, LucideXCircle
} from 'lucide-vue-next'
import type { EventRegistrationConfig, EventRegistration, RegistrationStatus } from '~/interfaces/event-registration-interface'

interface Props {
    registrationConfig?: EventRegistrationConfig
    userRegistration?: EventRegistration | null
    registeredCount?: number
    availableSpots?: number | null
}

const props = defineProps<Props>()

defineEmits<{
    register: []
    update: []
    cancel: []
}>()

const now = new Date()

// Computed properties for registration status
const hasRegistrationStarted = computed(() => {
    if (!props.registrationConfig?.registrationStart) return true
    return new Date(props.registrationConfig.registrationStart) <= now
})

const hasRegistrationEnded = computed(() => {
    if (!props.registrationConfig?.registrationEnd) return false
    return new Date(props.registrationConfig.registrationEnd) <= now
})

const isRegistrationOpen = computed(() => {
    if (!props.registrationConfig?.isEnabled) return false
    return hasRegistrationStarted.value && !hasRegistrationEnded.value
})

const isRegistrationFull = computed(() => {
    if (!props.registrationConfig?.participantLimit) return false
    const limit = props.registrationConfig.participantLimit
    const registered = props.registeredCount || 0
    return registered >= limit
})

const canRegister = computed(() => {
    return isRegistrationOpen.value && !isRegistrationFull.value
})

// User registration status styling
const userRegistrationStatusClass = computed(() => {
    if (!props.userRegistration) return ''

    switch (props.userRegistration.status) {
        case 'PENDING':
            return 'border-amber-200 bg-amber-50 text-amber-800'
        case 'CONFIRMED':
            return 'border-green-200 bg-green-50 text-green-800'
        case 'CANCELLED':
            return 'border-red-200 bg-red-50 text-red-800'
        default:
            return ''
    }
})

const userRegistrationStatusText = computed(() => {
    if (!props.userRegistration) return ''

    switch (props.userRegistration.status) {
        case 'PENDING':
            return 'Registration Pending'
        case 'CONFIRMED':
            return 'Registration Confirmed'
        case 'CANCELLED':
            return 'Registration Cancelled'
        default:
            return ''
    }
})

const userRegistrationIcon = computed(() => {
    if (!props.userRegistration) return null

    switch (props.userRegistration.status) {
        case 'PENDING':
            return LucideAlertCircle
        case 'CONFIRMED':
            return LucideCheckCircle
        case 'CANCELLED':
            return LucideXCircle
        default:
            return null
    }
})

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>
