export default async (path: string) => {
    const apiUri = useRuntimeConfig().public.apiUri;

    try {
        const auth = useAuthStore();

        let fingerprint = localStorage.getItem('fp')
        if (!fingerprint) {
            fingerprint = crypto.randomUUID()
            localStorage.setItem('fp', fingerprint)
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-fingerprint': fingerprint
        }

        // add token if logged in
        if (auth.access_token) {
            headers['Authorization'] = `Bearer ${auth.access_token}`
        }

        await $fetch(`${apiUri}/visit`, {
            method: 'POST',
            headers,
            body: {
                path
            }
        })
    } catch (error) {
    }
}
