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


    // ANOTHER OPTION
    // const response = await fetch(`${apiUri}/v1/auth/profile?${new URLSearchParams(query as Record<string, string>)}`, {
    //     headers: { Authorization: `Bearer ${token}` }
    // })

    // if (!response.ok) {
    //     throw createError({ statusCode: response.status, message: 'Failed to fetch user' })
    // }

    // const user = await response.json()

})
