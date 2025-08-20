export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore()

    if (!auth.user) {
        try {
            await auth.getAuthUser()
        } catch (error) {
            // console.error('Failed to get auth user:', error)
        }
    }
})
