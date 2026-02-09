<template>
  <div class="p-4 sm:p-8 max-w-6xl mx-auto">
    <UNotifications /> 

    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <NuxtLink to="/admin/dashboard" class="hover:text-[#09033B]">Dashboard</NuxtLink>
        <span>/</span>
        <NuxtLink v-if="student" :to="`/admin/classes/${student.class_level}`" class="hover:text-[#09033B]">
          {{ student.class_level }}
        </NuxtLink>
        <span v-else>...</span>
        <span>/</span>
        <span class="text-gray-900 font-medium">Profile</span>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-3xl font-bold text-[#09033B]">Student Profile</h1>
        </div>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#09033B]"></div>
      <p class="mt-2 text-gray-500">Loading student profile...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error loading profile: </strong>
      <span class="block sm:inline">{{ error.message }}</span>
    </div>

    <div v-else-if="student" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1 space-y-6">
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-[#09033B] h-24 relative">
             <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
               <div class="w-24 h-24 bg-white rounded-full p-1 shadow-lg overflow-hidden group">
                 <img 
                   v-if="student.photo_url" 
                   :src="student.photo_url" 
                   class="w-full h-full object-cover rounded-full" 
                   alt="Student Photo" 
                 />
                 <div v-else class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-[#09033B]">
                   {{ student.first_name.charAt(0) }}{{ student.last_name.charAt(0) }}
                 </div>
               </div>
             </div>
          </div>
          
          <div class="pt-12 pb-6 px-6 text-center">
            <h2 class="text-xl font-bold text-gray-900">{{ student.last_name }}, {{ student.first_name }}</h2>
            
            <div class="flex justify-center flex-wrap gap-2 mt-2">
              <span class="text-gray-500 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded border">
                {{ student.admission_number }}
              </span>
              <span v-if="student.special_needs" class="text-white font-bold text-xs bg-purple-600 px-2 py-0.5 rounded flex items-center gap-1">
                <UIcon name="i-heroicons-sparkles" class="w-3 h-3" />
                Special Needs
              </span>
            </div>

            <div class="mt-6 text-sm text-left space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
              <div class="flex justify-between border-b border-gray-200 pb-2">
                <span class="text-gray-500 text-xs uppercase font-bold">Class</span>
                <span class="font-medium text-[#09033B]">{{ student.class_level }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-200 pb-2">
                <span class="text-gray-500 text-xs uppercase font-bold">DOB</span>
                <span class="font-medium text-gray-900">{{ student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 text-xs uppercase font-bold">Gender</span>
                <span class="font-medium text-gray-900">{{ student.gender }}</span>
              </div>
            </div>

            <div class="mt-6 text-left">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
                Guardians
              </h4>
              
              <div v-if="student.parent1_name" class="bg-white border border-gray-200 p-2 rounded mb-2 shadow-sm">
                <p class="font-bold text-sm text-[#09033B]">{{ student.parent1_name }}</p>
                <div class="flex justify-between items-center mt-1">
                  <span class="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{{ student.parent1_rel || 'Guardian' }}</span>
                  <a v-if="student.parent1_phone" :href="`tel:${student.parent1_phone}`" class="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1">
                    <UIcon name="i-heroicons-phone" class="w-3 h-3" />
                    {{ student.parent1_phone }}
                  </a>
                </div>
              </div>

              <div v-if="student.parent2_name" class="bg-white border border-gray-200 p-2 rounded shadow-sm">
                <p class="font-bold text-sm text-[#09033B]">{{ student.parent2_name }}</p>
                <div class="flex justify-between items-center mt-1">
                  <span class="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{{ student.parent2_rel || 'Guardian' }}</span>
                  <a v-if="student.parent2_phone" :href="`tel:${student.parent2_phone}`" class="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1">
                    <UIcon name="i-heroicons-phone" class="w-3 h-3" />
                    {{ student.parent2_phone }}
                  </a>
                </div>
              </div>
            </div>

            <div v-if="student.allergies" class="mt-4 text-left">
              <h4 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                 <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                 Medical / Allergies
              </h4>
              <div class="bg-red-50 text-red-800 text-xs p-2 rounded border border-red-100 font-medium">
                {{ student.allergies }}
              </div>
            </div>

          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b">Management</h3>
          
          <div class="mb-6">
            <label class="block text-xs font-medium text-gray-500 mb-2">Promote / Move Class</label>
            <div class="flex gap-2">
              <select v-model="targetClass" class="flex-1 text-sm border-gray-300 rounded focus:ring-[#09033B] focus:border-[#09033B]">
                <option value="" disabled>Select Class...</option>
                <option v-for="cls in allClasses" :key="cls" :value="cls">{{ cls }}</option>
              </select>
              <button 
                @click="moveStudent"
                :disabled="!targetClass || isSubmitting" 
                class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Move
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-2">Danger Zone</label>
            <button 
              @click="deleteStudent"
              class="w-full border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
              Permanently Delete Student
            </button>
            <p class="text-[10px] text-gray-400 mt-1 text-center">Removes all grades, attendance, and reports.</p>
          </div>
        </div>

      </div>

      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="font-bold text-gray-800">Academic History</h3>
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ history.length }} Reports</span>
          </div>

          <div v-if="history.length === 0" class="p-12 text-center text-gray-400">
            <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 class="text-lg font-medium text-gray-900">No Records Found</h3>
            <p class="mt-1">This student has no academic records yet.</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div v-for="(rec, idx) in history" :key="idx" class="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
              <div class="flex items-center gap-4">
                 <div class="bg-blue-50 text-blue-800 font-bold p-3 rounded-lg text-xs text-center min-w-[70px] border border-blue-100">
                   {{ rec.session }}
                 </div>
                 <div>
                   <p class="font-bold text-gray-900 text-sm flex items-center gap-2">
                     {{ rec.term }}
                     <span class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">Generated</span>
                   </p>
                   <p class="text-xs text-gray-500 mt-0.5">Class: {{ rec.class_level }}</p>
                 </div>
              </div>
              
              <NuxtLink 
                :to="`/report/${student.id}?session=${rec.session}&term=${rec.term}`" 
                target="_blank" 
                class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors text-sm font-bold"
              >
                <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                View Report
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const studentId = route.params.id as string
const toast = useToast()

const isSubmitting = ref(false)
const targetClass = ref('')

const allClasses = [
  'Playgroup', 'Nursery 1', 'Nursery 2', 'Reading Readiness',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Graduated'
]

// --- FETCH DATA ---
const { data, pending, refresh, error } = await useFetch('/api/admin/student-details', {
  params: { id: studentId }
})

const student = computed(() => data.value?.student)
const history = computed(() => data.value?.history || [])

console.log(history)
console.log(student)

// --- ACTIONS ---

const moveStudent = async () => {
  if (!targetClass.value) return
  if (!confirm(`Move ${student.value.first_name} to ${targetClass.value}?`)) return

  isSubmitting.value = true
  try {
    await $fetch('/api/admin/student-manage', {
      method: 'POST',
      body: { 
        id: studentId, 
        new_class: targetClass.value, 
        action: 'move' 
      }
    })
    
    toast.add({ title: 'Success', description: `Student moved to ${targetClass.value}`, color: 'green' })
    await refresh()
    targetClass.value = ''
  } catch (err: any) {
    toast.add({ title: 'Error', description: 'Failed to move student', color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

const deleteStudent = async () => {
  if (!confirm(`Are you sure you want to PERMANENTLY delete ${student.value.first_name}? This cannot be undone.`)) return

  isSubmitting.value = true
  try {
    await $fetch('/api/admin/student-manage', {
      method: 'POST',
      body: { id: studentId, action: 'delete' }
    })
    
    toast.add({ title: 'Success', description: 'Student deleted successfully', color: 'green' })
    router.push('/admin/dashboard')
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to delete student', color: 'red' })
    isSubmitting.value = false
  }
}
</script>