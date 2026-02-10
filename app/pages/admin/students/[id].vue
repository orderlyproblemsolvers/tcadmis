<template>
  <div class="relative min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
    
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-5 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-5 opacity-0"
    >
      <div v-if="toastMessage" class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-3 min-w-[300px] justify-center"
        :class="toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
        <svg v-if="toastType === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5Z" clip-rule="evenodd" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="max-w-7xl mx-auto">
      
      <div class="mb-6 md:mb-8">
        <div class="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-4">
          <NuxtLink to="/admin/dashboard" class="hover:text-[#09033B] transition-colors">Dashboard</NuxtLink>
          <span class="text-gray-300">/</span>
          <NuxtLink v-if="student" :to="`/admin/classes/${student.class_level}`" class="hover:text-[#09033B] transition-colors font-medium">
            {{ student.class_level }}
          </NuxtLink>
          <span v-else>...</span>
          <span class="text-gray-300">/</span>
          <span class="text-gray-900 font-bold truncate">Profile</span>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 class="text-2xl md:text-3xl font-black text-[#09033B] tracking-tight">Student Profile</h1>
        </div>
      </div>

      <div v-if="pending" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#09033B]"></div>
        <p class="mt-4 text-gray-400 text-sm font-medium animate-pulse">Fetching records...</p>
      </div>

      <div v-else-if="error" class="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500 text-center">
        <div class="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">Error loading profile</h3>
        <p class="text-gray-500 text-sm mt-1 mb-4">{{ error.message }}</p>
        <button @click="refresh" class="text-sm text-[#09033B] font-bold underline hover:no-underline">Try Again</button>
      </div>

      <div v-else-if="student" class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            <div class="bg-[#09033B] h-24 w-full relative">
               <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
            </div>

            <div class="absolute top-12 left-1/2 transform -translate-x-1/2">
              <div class="w-24 h-24 bg-white rounded-full p-1.5 shadow-lg overflow-hidden group">
                <img 
                  v-if="student.photo_url" 
                  :src="student.photo_url" 
                  class="w-full h-full object-cover rounded-full border border-gray-100" 
                  alt="Student Photo" 
                />
                <div v-else class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-2xl font-black text-[#09033B] uppercase">
                  {{ student.first_name.charAt(0) }}{{ student.last_name.charAt(0) }}
                </div>
              </div>
            </div>
            
            <div class="pt-14 pb-6 px-6 text-center mt-2">
              <h2 class="text-xl font-bold text-gray-900">{{ student.last_name }}, {{ student.first_name }}</h2>
              
              <div class="flex flex-wrap justify-center gap-2 mt-2">
                <span class="text-gray-500 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {{ student.admission_number }}
                </span>
                <span v-if="student.special_needs" class="text-white font-bold text-[10px] uppercase bg-purple-600 px-2 py-1 rounded flex items-center gap-1">
                  Special Needs
                </span>
              </div>

              <div class="mt-6 text-sm text-left space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div class="flex justify-between border-b border-gray-200 pb-2">
                  <span class="text-gray-500 text-xs uppercase font-bold">Class</span>
                  <span class="font-bold text-[#09033B]">{{ student.class_level }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-200 pb-2">
                  <span class="text-gray-500 text-xs uppercase font-bold">DOB</span>
                  <span class="font-medium text-gray-900">{{ student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 text-xs uppercase font-bold">Gender</span>
                  <span class="font-medium text-gray-900 capitalize">{{ student.gender }}</span>
                </div>
              </div>

              <div class="mt-6 text-left">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">Guardians</h4>
                <div class="space-y-2">
                  <div v-if="student.parent1_name" class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                    <p class="font-bold text-sm text-[#09033B]">{{ student.parent1_name }}</p>
                    <div class="flex flex-wrap justify-between items-center mt-1 gap-1">
                      <span class="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 rounded">{{ student.parent1_rel || 'Guardian' }}</span>
                      <a v-if="student.parent1_phone" :href="`tel:${student.parent1_phone}`" class="text-blue-600 hover:underline text-xs font-bold">
                        {{ student.parent1_phone }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="student.allergies" class="mt-4 text-left">
                <div class="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-100">
                   <span class="block font-bold uppercase text-[10px] mb-0.5 text-red-600">Medical Alert</span>
                   <span class="font-medium leading-snug">{{ student.allergies }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">Student Management</h3>
            
            <div class="mb-6">
              <label class="block text-xs font-bold text-gray-500 mb-2">Promote / Change Class</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <select v-model="targetClass" class="w-full text-sm border-gray-300 rounded-lg focus:ring-[#09033B] focus:border-[#09033B] bg-gray-50">
                  <option value="" disabled>Select Target Class...</option>
                  <option v-for="cls in allClasses" :key="cls" :value="cls">{{ cls }}</option>
                </select>
                <button 
                  @click="moveStudent"
                  :disabled="!targetClass || isSubmitting" 
                  class="w-full sm:w-auto bg-[#09033B] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  Move
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 mb-2">Danger Zone</label>
              <button 
                @click="deleteStudent"
                :disabled="isSubmitting"
                class="w-full border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                Permanently Delete
              </button>
              <p class="text-[10px] text-gray-400 mt-2 text-center leading-tight">
                This action is irreversible. All records will be erased.
              </p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 class="text-lg font-bold text-[#09033B]">Curriculum Progress</h3>
              <p class="text-sm text-gray-600 mt-1">View ACE PACEs (RR01 - 1072) and scores.</p>
            </div>
            <NuxtLink 
              :to="`/admin/paces/${student.id}`" 
              class="w-full sm:w-auto bg-white border border-gray-300 hover:border-[#09033B] text-gray-700 hover:text-[#09033B] px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 text-center"
            >
              View Progress
            </NuxtLink>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col">
            <div class="px-4 py-4 sm:px-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
              <h3 class="font-bold text-gray-800 leading-none">Academic History</h3>
              <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                {{ history.length }} Records
              </span>
            </div>

            <div v-if="history.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <p class="text-sm font-medium">No academic records found.</p>
            </div>

            <div v-else class="divide-y divide-gray-50">
              <div v-for="(rec, idx) in history" :key="idx" class="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 bg-blue-50 text-blue-800 font-black p-3 rounded-lg text-xs text-center w-14 border border-blue-100 shadow-sm">
                      <span class="block text-[10px] opacity-60 font-medium uppercase">Sess</span>
                      {{ rec.session.split('/')[0] }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-base leading-tight">{{ rec.term }}</p>
                      <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 mt-2 inline-block">
                        Class: {{ rec.class_level }}
                      </span>
                    </div>
                  </div>
                  
                  <NuxtLink 
                    :to="`/report/${student.id}?session=${rec.session}&term=${rec.term}`" 
                    target="_blank" 
                    class="w-full sm:w-auto flex items-center justify-center gap-2 text-[#09033B] bg-white border border-gray-200 hover:border-[#09033B] hover:bg-gray-50 px-4 py-2 rounded-lg transition-all text-sm font-bold shadow-sm"
                  >
                    View Report
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()
const studentId = route.params.id as string

// Custom Toast Logic
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

const isSubmitting = ref(false)
const targetClass = ref('')

const allClasses = [
  'Playgroup', 'Nursery 1', 'Nursery 2', 'Reading Readiness',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Graduated'
]

const { data, pending, refresh, error } = await useFetch('/api/admin/student-details', {
  params: { id: studentId }
})

const student = computed(() => data.value?.student)
const history = computed(() => data.value?.history || [])

const moveStudent = async () => {
  if (!targetClass.value || !student.value) return
  if (!confirm(`Move ${student.value.first_name} to ${targetClass.value}?`)) return

  isSubmitting.value = true
  try {
    const res: any = await $fetch('/api/admin/student-manage', {
      method: 'POST',
      body: { 
        id: studentId, 
        new_class: targetClass.value, 
        action: 'move' 
      }
    })
    showToast(res.message || `Student moved to ${targetClass.value}`, 'success')
    await refresh()
    targetClass.value = ''
  } catch (err: any) {
    showToast('Failed to move student', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const deleteStudent = async () => {
  if (!student.value) return
  if (!confirm(`Are you sure you want to PERMANENTLY delete ${student.value.first_name}? This cannot be undone.`)) return

  isSubmitting.value = true
  try {
    await $fetch('/api/admin/student-manage', {
      method: 'POST',
      body: { id: studentId, action: 'delete' }
    })
    
    // Trigger toast and wait slightly so the user sees it before the redirect
    showToast('Student deleted successfully', 'success')
    
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 1500)
    
  } catch (err: any) {
    showToast(err.data?.message || 'Failed to delete student', 'error')
    isSubmitting.value = false
  }
}
</script>