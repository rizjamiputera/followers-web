<template>
    <div>
        <div>
            <p class="text-4xl mt-4">Forgot Password</p>
            <p class="text-lg font-extralight mt-4">Enter your email to receive a password reset link</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="alert alert-success mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ successMessage }}</span>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-error mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form v-if="!successMessage" class="flex flex-col gap-4 mt-10" @submit.prevent="handleSubmit">
            <Input type="email" v-model="email" label="Email Address" placeholder="Enter your email address"
                class="bg-transparent sm:input-lg font-light" required />

            <Button type="submit" class="w-full sm:btn-lg btn-green border-0 text-white mt-5"
                :disabled="!email || isLoading" :loading="isLoading">
                Send Reset Link
                <svg v-show="isLoading" class="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
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

        <!-- Additional Help -->
        <div v-if="successMessage" class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="font-semibold text-blue-900 mb-2">What's next?</h3>
            <ul class="text-sm text-blue-800 space-y-1">
                <li>• Check your email inbox (including spam folder)</li>
                <li>• Click the reset link within 1 hour</li>
                <li>• Create a new secure password</li>
                <li>• Login with your new password</li>
            </ul>
        </div>
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
const title = 'Forgot Password - Followers Bicara';
const description = "Reset your password for Followers Bicara account";

useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => webUri + '/logo-hitam.jpg',
    ogUrl: () => webUri + '/auth/forgot-password',
    twitterTitle: () => title,
    twitterDescription: () => description,
    twitterImage: () => webUri + '/logo-hitam.jpg',
    twitterCard: 'summary'
});

// Reactive data
const authStore = useAuthStore();
const email = ref('');
const successMessage = ref('');
const errorMessage = ref('');

// Computed
const isLoading = computed(() => authStore.resetPasswordLoading);

// Methods
const handleSubmit = async () => {
    if (!email.value || isLoading.value) return;

    // Clear previous messages
    successMessage.value = '';
    errorMessage.value = '';

    try {
        const result = await authStore.handleForgotPassword(email.value) as any;

        if (result.success) {
            successMessage.value = result.message;
            // Clear the email field
            email.value = '';
        } else {
            errorMessage.value = result.message;
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        errorMessage.value = 'An unexpected error occurred. Please try again.';
    }
};

// Clear error message when user starts typing
watch(email, () => {
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
</style>
