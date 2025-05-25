// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const accessToken = useCookie('access_token', { maxAge: 60 * 5 })
    const refreshToken = useCookie('refresh_token', { maxAge: 60 * 60 * 24 * 1 }) 
    const config = useRuntimeConfig()
    const login = async (username: string, password: string) => {
        const { data, error } = await useFetch('/token/pair', {
            baseURL: config.public.apiBaseUrl,
            method: 'POST',
            body: { username, password },
        })

        if (error.value) throw error.value

        accessToken.value = data.value.access
        refreshToken.value = data.value.refresh
    }

    const refresh = async () => {
        if (!refreshToken.value) return false

        const { data, error } = await useFetch('/token/refresh', {
            baseURL: config.public.apiBaseUrl,
            method: 'POST',
            body: { refresh: refreshToken.value },
        })

        if (error.value) {
            accessToken.value = null
            refreshToken.value = null
            return false
        }

        accessToken.value = data.value.access
        console.log(accessToken.value)
        return true
    }

    const logout = () => {
        accessToken.value = null
        refreshToken.value = null
    }

    return {
        accessToken,
        refreshToken,
        login,
        logout,
        refresh,
    }
})
