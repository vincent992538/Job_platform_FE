<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-4">Post New Job</h1>

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

    <form @submit.prevent="submitJob" class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Job Title</label>
        <input type="text" v-model="job.title" required class="w-full border border-gray-300 rounded px-3 py-2" />
      </div>

      <div>
        <label class="block font-semibold mb-1">Company</label>
        <input type="text" v-model="job.company_name" required class="w-full border border-gray-300 rounded px-3 py-2" />
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
        <textarea type="text" v-model="requiredSkillsString" class="w-full border border-gray-300 rounded px-3 py-2" ></textarea>
      </div>

      <div class="flex justify-between items-center pt-4">
        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          Post Job
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '~/composables/fetchWithAuth'

const job = ref({
  title: '',
  company_name: '',
  description: '',
  location: '',
  salary_range: '',
  posting_date: '',
  expiration_date: '',
})

const requiredSkillsString = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const router = useRouter()

const submitJob = async () => {
  try {
    loading.value = true
    const postDate = new Date(job.value.posting_date)
    const expDate = new Date(job.value.expiration_date)

    if (postDate >= expDate) {
        message.value = 'Expiration Date must after Posting Date'
        messageType.value = 'error'
        return
    }

    const jobData = {
      ...job.value,
      required_skills: requiredSkillsString.value.split('\n').map(s => s.trim()),
    }

    const res = await fetchWithAuth('/jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    })

    message.value = 'Job posted successfully!'
    messageType.value = 'success'

    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (err) {
    message.value = 'Error posting job: ' + err.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const backToList = () => {
  router.push('/dashboard')
}
</script>
