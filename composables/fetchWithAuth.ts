export const fetchWithAuth = async (url: string, options = {}) => {
    const auth = useAuthStore()
    const config = useRuntimeConfig()
    const router = useRouter()

    const fetchOptions = {
        baseURL: config.public.apiBaseUrl,
        headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        },
        ...options,
    }
    try {
        return await $fetch(url, fetchOptions)
    } catch (err: any) {
        if (err?.response?.status === 401) {  // Refresh auth token one time to reduce login times
            if (auth.refreshToken) {
                const refreshed = await auth.refresh()
                if (refreshed) {
                    return await $fetch(url, fetchOptions)
                }
            }
            router.push('/')
        }
        throw err
    }
}