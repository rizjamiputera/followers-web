// Prime the category list once per request. Runs on SSR so the header
// nav renders with categories in the initial HTML; Pinia hydration
// carries the state to the client — no second fetch on mount.
export default defineNuxtPlugin(async () => {
    const store = useCategoriesStore()
    if (!store.loaded) {
        await store.fetch()
    }
})
