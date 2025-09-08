export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("access_token")

    if (to.path.startsWith('/auth/') && from.path && !to.query.redirect) {
        if (!from.path.startsWith('/auth/')) {
            return navigateTo(`${to.path}?redirect=${encodeURIComponent(from.path as string)}`)
        }
    }

    if (to.path.startsWith('/auth')) {
        if (token.value != null) {
            return navigateTo('/')
        }
    }

    if (to.path.startsWith('/cp')) {
        if (token.value == undefined) {
            return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
        }

        const AuthStore = useAuthStore()

        if (AuthStore.user && AuthStore.user.role == "USER") {
            return navigateTo('/')
        }
    }
})
