<template>
  <div>
    <h1>Job Postings</h1>

    <!-- Search and Filter Section -->
    <div class="p-4 space-y-4">
        <input
        v-model="searchQuery"
        type="text"
        class="w-full border p-2"
        placeholder="Search job title, description, company name"
        />

        <!-- Filter: Status -->
        <select v-model="selectedStatus" class="border p-2 w-full">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        <option value="scheduled">Scheduled</option>
        </select>

        <!-- Filter: Skill -->
        <input
        v-model="searchSkill"
        type="text"
        class="w-full border p-2"
        placeholder="Search Skill"
        />

        <!-- Filter: Location -->
        <input
        v-model="searchLocation"
        type="text"
        class="w-full border p-2"
        placeholder="Search Location"
        />
        <input
        v-model="searchSalary"
        type="text"
        class="w-full border p-2"
        placeholder="Search Salary range"
        />
        <div class="flex justify-between items-center mt-4">
            <div>
                <button @click="fetchJobs" class="px-4 py-2 bg-blue-500 text-white rounded">Search</button>
                <button @click="clearSearch" class="px-4 py-2 bg-blue-500 text-white rounded ml-2">Clear</button>
            </div>

            <div>
                <button @click="goToNewJobPage" class="px-4 py-2 bg-green-500 text-white rounded">Post New Job</button>
            </div>
        </div>
    </div>
    <div v-if="loading" class="text-center py-4">Loading...</div>

    <div v-else>
    <table class="w-full table-auto border border-gray-300">
        <thead class="bg-gray-100">
        <tr>
            <th class="px-4 py-2 border">Job Title</th>
            <th class="px-4 py-2 border">Company</th>
            <th class="px-4 py-2 border">Description</th>
            <th class="px-4 py-2 border">Location</th>
            <th class="px-4 py-2 border">Salary</th>
            <th class="px-4 py-2 border">Required Skills</th>
            <th class="px-4 py-2 border cursor-pointer" @click="sortBy('posting_date')">
                Posting Date
                <span v-if="sortKey === 'posting_date'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
                </span>
            </th>
            <th class="px-4 py-2 border cursor-pointer" @click="sortBy('expiration_date')">
                Expiration Date
                <span v-if="sortKey === 'expiration_date'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
                </span>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50">
            
            <td class="px-4 py-2 border">
                <NuxtLink
                    :to="`/jobs/${job.id}`"
                    class="text-blue-600 hover:underline hover:text-blue-800 flex items-center gap-1 cursor-pointer transition"
                >
                    <svg
                    class="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{{ job.title }}</span>
                </NuxtLink>
            </td>
            <td class="px-4 py-2 border">{{ job.company_name }}</td>
            <td class="px-4 py-2 border">{{ job.description }}</td>
            <td class="px-4 py-2 border">{{ job.location }}</td>
            <td class="px-4 py-2 border">{{ job.salary_range }}</td>
            <td class="px-4 py-2 border">{{ job.required_skills }}</td>
            <td class="px-4 py-2 border">{{ job.posting_date }}</td>
            <td class="px-4 py-2 border">{{ job.expiration_date }}</td>
        </tr>
        </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex items-center justify-center gap-4 mt-4">
        <button
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="page <= 1"
        @click="changePage(page - 1)"
        >
        Previous
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="page >= totalPages"
        @click="changePage(page + 1)"
        >
        Next
        </button>
    </div>
    </div>


  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchWithAuth } from '~/composables/fetchWithAuth';

const route = useRoute();
const router = useRouter();

const searchQuery = ref(route.query.query || '');
const selectedStatus = ref(route.query.status || '');
const searchSkill = ref(route.query.required_skills || '');
const searchLocation = ref(route.query.location || '');
const searchSalary = ref(route.query.salary_range || '');
const page = ref(parseInt(route.query.page) || 1);

const jobs = ref([]);
const totalPages = ref(1);
const skills = ref(['JavaScript', 'Python', 'Ruby', 'Java']);
const loading = ref(false);
const sortKey = ref(route.query.sortKey || '')
const sortOrder = ref(route.query.sortOrder || 'asc')

const fetchJobs = async () => {
    loading.value = true;
    try {
        const params = new URLSearchParams()
        if (searchQuery.value) params.append('query', searchQuery.value)
        if (selectedStatus.value) params.append('status', selectedStatus.value)
        if (searchSkill.value) params.append('required_skill', searchSkill.value)
        if (searchLocation.value) params.append('location', searchLocation.value)
        if (searchSalary.value) params.append('salary_range', searchSalary.value)
        if (sortKey.value) {
            if (sortOrder.value == 'desc') {
                params.append('ordering', `-${sortKey.value}`)
            } else{
                params.append('ordering', sortKey.value)
            }
        }
        params.append('page', page.value.toString())
        const res = await fetchWithAuth(`/jobs/?${params.toString()}`);

        if (res) {
            jobs.value = res.items;
            totalPages.value = Math.ceil(res.total / res.per_page);
            updateQueryParams();
        }
    } catch (err) {
        console.error('Fetch error:', err);
    } finally {
        loading.value = false;
    }
}


const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortOrder.value = 'asc'
    }
}

// Watch for changes in query parameters and refetch data
watch([page, sortKey, sortOrder], () => {
    updateQueryParams();
    fetchJobs();
});

const updateSearchQuery = () => {
    searchQuery.value = searchQuery.value.trim();
};

const updateSkillFilter = () => {
    searchSkill.value = searchSkill.value || '';
};

const changePage = (newPage) => {
    page.value = newPage;
};

const updateQueryParams = () => {
    let query = {}
    if (searchQuery.value) query['query'] = searchQuery.value
    if (selectedStatus.value) query['status'] = selectedStatus.value
    if (searchSkill.value) query['required_skills'] = searchSkill.value
    if (searchLocation.value) query['location'] = searchLocation.value
    if (searchSalary.value) query['salary_range'] = searchSalary.value
    if (sortKey.value) query['sortKey'] = sortKey.value
    if (sortOrder.value) query['sortOrder'] = sortOrder.value
    router.push({
        query: query
    });
};

const clearSearch = () => {
    searchQuery.value = ''
    selectedStatus.value = ''
    searchSkill.value = ''
    searchLocation.value = ''
    searchSalary.value = ''
    page.value = 1
    fetchJobs()
}

onMounted(() => {
    fetchJobs();
});

const goToJobDetail = (jobId) => {
    router.push(`/jobs/${jobId}`)
}

const goToNewJobPage = () => {
    router.push(`/jobs/new`)
}
</script>
