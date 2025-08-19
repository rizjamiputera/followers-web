export default defineEventHandler(async (event) => {
    const { slug } = getRouterParams(event)
    const { public: { apiUri } } = useRuntimeConfig();

    // call your external API from the server
    const res = await $fetch(`${apiUri}/v1/article/read/${slug}`)

    // optionally modify response (filter, format, etc.)
    return res
})
