<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-6 rounded shadow-md w-80 space-y-4">
      <h2 class="text-xl font-semibold text-center">Login Job Platform</h2>

      <input
        v-model="username"
        type="text"
        placeholder="username"
        class="w-full px-4 py-2 border rounded"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="password"
        class="w-full px-4 py-2 border rounded"
        required
      />

      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Log in
      </button>

      <p v-if="errorMessage" class="text-red-500 text-sm text-center">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const auth = useAuthStore()

const login = async () => {
    try {
        await auth.login(username.value, password.value)
        router.push('/dashboard')
    } catch (err) {
        errorMessage.value = 'Login fail, Please Check your username or password'
    }
}
</script>