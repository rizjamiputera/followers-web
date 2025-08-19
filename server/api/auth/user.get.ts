export default defineEventHandler(async (event) => {
    const token = getCookie(event, "access_token")
    if (!token) {
        throw createError({ statusCode: 401, message: "Not authenticated" })
    }

    const query = getQuery(event)
    const { public: { apiUri } } = useRuntimeConfig();

    try {
        // verify token or call backend
        const user = await $fetch(`${apiUri}/v1/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            query
        })

        return user
    } catch (error) {
        throw error;
    }

})
