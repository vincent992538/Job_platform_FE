<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="flex justify-between items-center p-4 bg-gray-100 shadow">
      <h1 class="text-xl font-bold">Job Platform</h1>
      <button
        v-if="showLogout"
        @click="logout"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition ml-auto"
      >
        Logout
      </button>
    </header>

    <main class="p-6">
        <NuxtPage />
    </main>
    
    <footer class="p-4 text-sm text-center text-gray-500">
      © 2025 Job Platform
    </footer>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const logout = () => {
    auth.logout?.()
    auth.accessToken = null
    auth.refreshToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/')
}

const showLogout = computed(() => route.path !== '/')
</script>