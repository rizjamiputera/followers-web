<template>
    <div>
        <div>
            <p class="text-4xl mt-4">Reset Password</p>
            <p class="text-lg font-extralight mt-4">Enter your new password below</p>
        </div>

        <!-- Error Messages -->
        <div v-if="errorMessage" class="alert alert-error mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <!-- Success State -->
        <div v-if="resetSuccess" class="text-center py-8">
            <div class="alert alert-success mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ successMessage }}</span>
            </div>

            <ButtonLink class="btn-green" to="navigateTo('/auth/login')">
                Go to Login
            </ButtonLink>
        </div>

        <!-- Reset Form -->
        <form v-else class="flex flex-col gap-4 mt-10" @submit.prevent="handleSubmit">
            <!-- New Password -->
            <div class="form-control">
                <Input type="password" v-model="newPassword" label="New Password"
                    placeholder="Enter your new password (min. 8 characters)"
                    class="bg-transparent sm:input-lg font-light" :required="true" minlength="8" />
                <div class="label">
                    <span class="label-text-alt text-sm text-gray-600">
                        Password must be at least 8 characters long
                    </span>
                </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-control">
                <Input type="password" v-model="confirmPassword" label="Confirm New Password"
                    placeholder="Confirm your new password"
                    :class="`bg-transparent sm:input-lg font-light ${confirmPassword && newPassword !== confirmPassword ? 'input-error' : ''}`"
                    :required="true" />
                <div class="label" v-if="confirmPassword && newPassword !== confirmPassword">
                    <span class="label-text-alt text-error text-sm">
                        Passwords do not match
                    </span>
                </div>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="newPassword" class="mt-2">
                <div class="text-sm font-medium mb-2">Password Strength:</div>
                <div class="flex gap-1 mb-2">
                    <div v-for="i in 4" :key="i" class="flex-1 h-2 rounded" :class="getStrengthBarClass(i)"></div>
                </div>
                <div class="text-xs" :class="getStrengthTextClass()">
                    {{ getStrengthText() }}
                </div>
            </div>

            <Button type="submit" class="w-full sm:btn-lg btn-green border-0 text-white mt-5"
                :disabled="!isFormValid || isLoading" :loading="isLoading">
                Reset Password
            </Button>
        </form>

        <!-- Back to Login -->
        <Divider class="mt-15">
            <NuxtLink to="/auth/login" class="font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Login
            </NuxtLink>
        </Divider>
    </div>
</template>

<script lang="ts" setup>
import Input from '~/components/input.vue';

definePageMeta({
    layout: 'auth'
});

onMounted(recordVisit);

// SEO and META
const { public: { webUri } } = useRuntimeConfig();
const title = 'Reset Password - Followers Bicara';
const description = "Create a new password for your Followers Bicara account";

useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => webUri + '/logo-hitam.jpg',
    ogUrl: () => webUri + '/auth/reset-password',
    twitterTitle: () => title,
    twitterDescription: () => description,
    twitterImage: () => webUri + '/logo-hitam.jpg',
    twitterCard: 'summary'
});

// Get token from URL query params
const route = useRoute();
const token = computed(() => route.query.token as string);

// Reactive data
const authStore = useAuthStore();
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const resetSuccess = ref(false);

// Computed properties
const isLoading = computed(() => authStore.resetPasswordLoading);

const isFormValid = computed(() => {
    return token.value &&
        newPassword.value &&
        newPassword.value.length >= 8 &&
        confirmPassword.value &&
        newPassword.value === confirmPassword.value;
});

const passwordStrength = computed(() => {
    const password = newPassword.value;
    let score = 0;

    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    return Math.min(score, 4);
});

// Methods
const getStrengthBarClass = (index: number) => {
    if (passwordStrength.value >= index) {
        if (passwordStrength.value <= 1) return 'bg-red-500';
        if (passwordStrength.value <= 2) return 'bg-yellow-500';
        if (passwordStrength.value <= 3) return 'bg-blue-500';
        return 'bg-green-500';
    }
    return 'bg-gray-200';
};

const getStrengthTextClass = () => {
    if (passwordStrength.value <= 1) return 'text-red-600';
    if (passwordStrength.value <= 2) return 'text-yellow-600';
    if (passwordStrength.value <= 3) return 'text-blue-600';
    return 'text-green-600';
};

const getStrengthText = () => {
    if (passwordStrength.value <= 1) return 'Weak';
    if (passwordStrength.value <= 2) return 'Fair';
    if (passwordStrength.value <= 3) return 'Good';
    return 'Strong';
};

const handleSubmit = async () => {
    if (!isFormValid.value || isLoading.value) return;

    // Clear previous messages
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const result = await authStore.handleResetPassword(token.value, newPassword.value) as any;

        if (result.success) {
            successMessage.value = result.message;
            resetSuccess.value = true;

            // Clear form
            newPassword.value = '';
            confirmPassword.value = '';
        } else {
            errorMessage.value = result.message;
        }
    } catch (error) {
        console.error('Reset password error:', error);
        errorMessage.value = 'An unexpected error occurred. Please try again.';
    }
};

// Validate token on mount
onMounted(() => {
    if (!token.value) {
        errorMessage.value = 'Invalid reset token. Please request a new password reset.';
    }
});

// Clear error message when user starts typing
watch([newPassword, confirmPassword], () => {
    if (errorMessage.value) {
        errorMessage.value = '';
    }
});
</script>

<style scoped>
@reference "@/assets/css/main.css";

.alert {
    @apply flex items-center p-4 rounded-lg;
}

.alert-success {
    @apply bg-green-50 border border-green-200 text-green-800;
}

.alert-error {
    @apply bg-red-50 border border-red-200 text-red-800;
}

.input-error {
    @apply border-red-500 focus:border-red-500;
}
</style>
