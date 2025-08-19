export default defineEventHandler(async (event) => {
    const token = getCookie(event, "access_token")
    if (!token) {
        throw createError({ statusCode: 401, message: "Not authenticated" })
    }

    const { public: { apiUri } } = useRuntimeConfig();

    try {
        // verify token or call backend
        const user = await $fetch(`${apiUri}/v1/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        console.log({ user })

        return user
    } catch (error) {
        throw error;
    }

})
