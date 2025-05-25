<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded">
    <div v-if="loading" class="text-center text-gray-500 text-lg">Loading...</div>

    <div v-else-if="job">
      <h1 class="text-2xl font-bold mb-4">Edit Job</h1>

      <!-- Success/Error Message -->
      <div 
        v-if="message"
        :class="[
          'p-3 mb-4 rounded text-white',
          messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ message }}
      </div>

      <!-- Job Form -->
      <form @submit.prevent="updateJob" class="space-y-4">
        <div>
          <label class="block font-semibold mb-1">Job Title</label>
          <input type="text" v-model="job.title" required class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label class="block font-semibold mb-1">Company</label>
          <div class="text-gray-700">{{ job.company_name }}</div>
        </div>

        <div>
          <label class="block font-semibold mb-1">Description</label>
          <textarea v-model="job.description" required class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
        </div>

        <div>
          <label class="block font-semibold mb-1">Location</label>
          <input type="text" v-model="job.location" required class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label class="block font-semibold mb-1">Salary Range</label>
          <input type="text" v-model="job.salary_range" required class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Posting Date</label>
            <input type="date" v-model="job.posting_date" required class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <label class="block font-semibold mb-1">Expiration Date</label>
            <input type="date" v-model="job.expiration_date" required class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label class="block font-semibold mb-1">Required Skills</label>
          <input type="text" v-model="requiredSkillsString" class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <!-- Buttons -->
        <div class="flex justify-between items-center pt-4">
          <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          Update Job
        </button>
        <button 
          type="button" 
          @click="backToList"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
        >
          Back to Job List
        </button>
        </div>
      </form>
    </div>

    <div v-else class="text-center text-gray-500">
      <p>Job not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWithAuth } from '~/composables/fetchWithAuth'

const route = useRoute()
const router = useRouter()
const job = ref({
    title: '',
    company_name: '',
    description: '',
    location: '',
    salary_range: '',
    posting_date: '',
    expiration_date: '',
    required_skills: []
})
const loading = ref(true)
const message = ref('')
const messageType = ref('') // 'success' or 'error'

const requiredSkillsString = computed({
    get() {
        return job.value.required_skills.join(', ') // Convert array to string
    },
    set(value) {
        job.value.required_skills = value.split(',').map(skill => skill.trim()) // Convert string back to array
    }
})

onMounted(async () => {
    console.log('Component mounted')
    const { id } = route.params
    try {
        const res = await fetchWithAuth(`/jobs/${id}`);
        if (res) {
            job.value = res
        }
    } catch (err) {
        console.error('Fetch error:', err);
    } finally {
        loading.value = false;
    }
})

const updateJob = async () => {
    const { id } = route.params
    const postDate = new Date(job.value.posting_date)
    const expDate = new Date(job.value.expiration_date)

    if (postDate >= expDate) {
        message.value = 'Expiration Date must after Posting Date'
        messageType.value = 'error'
        return
    }
    try {
        const data = await fetchWithAuth(`/jobs/${id}`, {
            method: 'PUT',
            body: job.value
        })

        message.value = 'Job updated successfully!'
        messageType.value = 'success'

        setTimeout(() => {
            router.push('/dashboard')
        }, 2000)
    } catch (error) {
        const errorMessage =
        error?.data?.message || error?.message || 'Unknown error'

        message.value = 'Error updating job: ' + errorMessage
        messageType.value = 'error'
    }
}
const backToList = () => {
    router.push('/dashboard')
}
</script>
