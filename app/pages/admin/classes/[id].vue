<template>
  <div class="p-4 sm:p-8">
    <UiToast />

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <NuxtLink to="/admin/dashboard" class="text-sm text-gray-500 hover:text-[#09033B] mb-2 inline-flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </NuxtLink>
        <h1 class="text-2xl sm:text-3xl font-bold text-[#09033B]">{{ className }}</h1>
        <p class="text-gray-500 text-sm sm:text-base">{{ students.length }} Students Enrolled</p>
      </div>

      <div class="flex gap-2 sm:gap-4 w-full md:w-auto">
        <div class="hidden sm:flex bg-white px-3 py-1 rounded border border-gray-200 shadow-sm flex-col items-center min-w-[80px]">
          <span class="text-[10px] text-gray-400 uppercase font-bold">Boys</span>
          <span class="text-xl font-bold text-blue-600">{{ students.filter(s => s.gender === 'Male').length }}</span>
        </div>
        <div class="hidden sm:flex bg-white px-3 py-1 rounded border border-gray-200 shadow-sm flex-col items-center min-w-[80px]">
          <span class="text-[10px] text-gray-400 uppercase font-bold">Girls</span>
          <span class="text-xl font-bold text-pink-600">{{ students.filter(s => s.gender === 'Female').length }}</span>
        </div>
        
        <button 
          @click="openAddModal"
          class="flex-1 md:flex-none justify-center bg-[#09033B] text-white px-6 py-2 rounded shadow hover:bg-opacity-90 flex items-center gap-2 transition-colors h-full"
        >
          <span class="text-xl font-bold leading-none mb-0.5">+</span> 
          <span>Add Student</span>
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Admission No</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr 
              v-for="student in students" 
              :key="student.id" 
              class="hover:bg-blue-50 transition-colors cursor-pointer group"
              @click="navigateToProfile(student.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {{ student.admission_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900 group-hover:text-blue-900">
                  {{ student.last_name }}, {{ student.first_name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 py-1 text-xs font-bold rounded-full', student.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700']">
                  {{ student.gender }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end items-center gap-3">
                  <span class="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile →
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="students.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">
                No students found. Click "Add Student" to enroll one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-all">
        <div class="bg-[#09033B] px-6 py-4 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">Register New Student</h3>
          <button @click="showAddModal = false" class="text-gray-300 hover:text-white">&times;</button>
        </div>
        
        <form @submit.prevent="addStudent" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
              <input v-model="newStudent.first_name" type="text" required class="w-full border-gray-300 rounded focus:ring-[#09033B] focus:border-[#09033B] p-2 border text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
              <input v-model="newStudent.last_name" type="text" required class="w-full border-gray-300 rounded focus:ring-[#09033B] focus:border-[#09033B] p-2 border text-sm">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Number</label>
            <input v-model="newStudent.admission_number" type="text" required placeholder="e.g. TC/2026/001" class="w-full border-gray-300 rounded focus:ring-[#09033B] focus:border-[#09033B] p-2 border text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
            <select v-model="newStudent.gender" class="w-full border-gray-300 rounded focus:ring-[#09033B] focus:border-[#09033B] p-2 border text-sm">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="bg-[#09033B] text-white px-6 py-2 rounded text-sm font-bold hover:bg-opacity-90 disabled:opacity-50">
              {{ isSubmitting ? 'Saving...' : 'Register' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const className = route.params.id as string

// Safe Toast Fallback
const toastComposable = useToast ? useToast() : null
const showToast = toastComposable?.showToast || ((msg: string) => alert(msg));

// State
const showAddModal = ref(false)
const isSubmitting = ref(false)

// Data Fetching
const { data, refresh } = await useFetch('/api/admin/class-details', {
  params: { class_name: className }
})

const students = computed(() => data.value?.students || [])

// Form Data
const newStudent = ref({
  first_name: '',
  last_name: '',
  admission_number: '',
  gender: 'Male'
})

// --- ACTIONS ---

const navigateToProfile = (studentId: number) => {
  router.push(`/admin/students/${studentId}`)
}

const openAddModal = () => {
  newStudent.value = { first_name: '', last_name: '', admission_number: '', gender: 'Male' }
  showAddModal.value = true
}

// CREATE STUDENT
const addStudent = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/admin/student-manage', {
      method: 'POST',
      body: { ...newStudent.value, class_level: className, action: 'create' }
    })
    
    await refresh()
    showToast('Student registered successfully', 'success')
    showAddModal.value = false
  } catch (err: any) {
    showToast(err.data?.message || 'Failed to add student', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>