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
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="max-w-7xl mx-auto">
      
      <div class="mb-6 md:mb-8">
        <div class="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-4">
          <NuxtLink to="/admin/dashboard" class="hover:text-[#09033B] transition-colors">Dashboard</NuxtLink>
          <span class="text-gray-300">/</span>
          <span class="text-gray-900 font-bold truncate">Profile</span>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 class="text-2xl md:text-3xl font-black text-[#09033B] tracking-tight">Student Profile</h1>
          
          <div v-if="student">
            <button 
              v-if="!isEditing"
              @click="startEditing"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#09033B] transition-all shadow-sm"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              Edit Details
            </button>
            <div v-else class="flex gap-2">
              <button @click="cancelEditing" class="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200">Cancel</button>
              <button @click="saveChanges" :disabled="isSubmitting" class="px-4 py-2 bg-[#09033B] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 shadow-md">
                {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pending" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#09033B]"></div>
        <p class="mt-4 text-gray-400 text-sm font-medium animate-pulse">Fetching records...</p>
      </div>

      <div v-else-if="student" class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            <div class="bg-[#09033B] h-24 w-full relative">
               <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
            </div>

            <div class="absolute top-12 left-1/2 transform -translate-x-1/2">
              <div class="w-24 h-24 bg-white rounded-full p-1.5 shadow-lg overflow-hidden group relative">
                <img 
                  :src="isEditing ? editForm.photo_url || '/img/placeholder.png' : student.photo_url" 
                  class="w-full h-full object-cover rounded-full border border-gray-100" 
                />
                
                <div v-if="!student.photo_url && !editForm.photo_url" class="absolute inset-0 flex items-center justify-center bg-gray-100 text-[#09033B] text-2xl font-black uppercase">
                  {{ student.first_name.charAt(0) }}
                </div>

                <label v-if="isEditing" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <UIcon v-if="!uploading" name="i-heroicons-camera" class="w-6 h-6 text-white" />
                  <span v-if="!uploading" class="text-[8px] text-white font-bold uppercase mt-1">Change</span>
                  <UIcon v-else name="i-heroicons-arrow-path" class="w-6 h-6 text-white animate-spin" />
                  <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                </label>
              </div>
            </div>
            
            <div class="pt-14 pb-6 px-6 text-center mt-2">
              <div v-if="!isEditing">
                <h2 class="text-xl font-bold text-gray-900">{{ student.last_name }}, {{ student.first_name }}</h2>
                <div class="flex flex-wrap justify-center gap-2 mt-2">
                  <span class="text-gray-500 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{{ student.admission_number }}</span>
                  <span v-if="student.special_needs" class="text-white font-bold text-[10px] uppercase bg-purple-600 px-2 py-1 rounded">Special Needs</span>
                </div>
              </div>
              <div v-else class="space-y-2">
                <input v-model="editForm.first_name" placeholder="First Name" class="w-full border p-2 rounded text-sm text-center font-bold" />
                <input v-model="editForm.last_name" placeholder="Last Name" class="w-full border p-2 rounded text-sm text-center font-bold" />
                <input v-model="editForm.admission_number" placeholder="Adm No." class="w-full border p-2 rounded text-xs text-center font-mono" />
                <label class="flex items-center justify-center gap-2 mt-2">
                  <input type="checkbox" v-model="editForm.special_needs" class="rounded text-[#09033B]" />
                  <span class="text-xs text-gray-600 font-bold">Special Needs?</span>
                </label>
              </div>

              <div class="mt-6 text-sm text-left space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                
                <div class="flex justify-between border-b border-gray-200 pb-2 items-center">
                  <span class="text-gray-500 text-xs uppercase font-bold">Class</span>
                  <span v-if="!isEditing" class="font-bold text-[#09033B]">{{ student.class_level }}</span>
                  <select v-else v-model="editForm.class_level" class="text-xs border rounded p-1">
                    <option v-for="c in allClasses" :key="c">{{ c }}</option>
                  </select>
                </div>

                <div class="flex justify-between border-b border-gray-200 pb-2 items-center">
                  <span class="text-gray-500 text-xs uppercase font-bold">DOB</span>
                  <span v-if="!isEditing" class="font-medium text-gray-900">{{ student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A' }}</span>
                  <input v-else type="date" v-model="editForm.dob" class="text-xs border rounded p-1 w-32" />
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-500 text-xs uppercase font-bold">Gender</span>
                  <span v-if="!isEditing" class="font-medium text-gray-900 capitalize">{{ student.gender }}</span>
                  <select v-else v-model="editForm.gender" class="text-xs border rounded p-1">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div class="flex justify-between items-center pt-2 border-t border-gray-200">
                   <span class="text-gray-500 text-xs uppercase font-bold">Access PIN</span>
                   <span v-if="!isEditing" class="font-mono font-black text-indigo-600 tracking-widest">{{ student.access_code || '----' }}</span>
                   <div v-else class="flex gap-1">
                     <input v-model="editForm.access_code" class="w-16 text-xs border rounded p-1 font-mono text-center" />
                     <button @click="generatePin" class="bg-indigo-100 text-indigo-700 px-2 rounded text-[10px] font-bold">Gen</button>
                   </div>
                </div>
              </div>

              <div class="mt-6 text-left">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Guardian Info</h4>
                <div v-if="!isEditing" class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  <p class="font-bold text-sm text-[#09033B]">{{ student.parent1_name || 'No Guardian Listed' }}</p>
                  <p class="text-xs text-gray-500">{{ student.parent1_rel }} • {{ student.parent1_phone }}</p>
                </div>
                <div v-else class="space-y-2">
                  <input v-model="editForm.parent1_name" placeholder="Guardian Name" class="w-full border p-2 rounded text-xs" />
                  <div class="flex gap-2">
                    <input v-model="editForm.parent1_rel" placeholder="Relationship" class="w-1/2 border p-2 rounded text-xs" />
                    <input v-model="editForm.parent1_phone" placeholder="Phone" class="w-1/2 border p-2 rounded text-xs" />
                  </div>
                </div>
              </div>
              
              <div class="mt-4 text-left">
                <div v-if="!isEditing && student.allergies" class="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-100">
                   <span class="block font-bold uppercase text-[10px] mb-0.5 text-red-600">Medical Alert</span>
                   <span class="font-medium">{{ student.allergies }}</span>
                </div>
                <div v-else-if="isEditing">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Medical Notes / Allergies</label>
                  <textarea v-model="editForm.allergies" rows="2" class="w-full border p-2 rounded text-xs mt-1"></textarea>
                </div>
              </div>

            </div>
          </div>

          <div v-if="!isEditing" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <div class="mb-4">
                <label class="block text-xs font-bold text-gray-500 mb-2">Move Class</label>
                <div class="flex gap-2">
                  <select v-model="targetClass" class="w-full text-sm border-gray-300 rounded-lg bg-gray-50">
                    <option value="">Select Class...</option>
                    <option v-for="c in allClasses" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <button @click="moveStudent" :disabled="!targetClass" class="bg-[#09033B] text-white px-3 py-2 rounded-lg text-sm font-bold">Move</button>
                </div>
             </div>
             <button @click="deleteStudent" class="w-full text-red-600 bg-red-50 border border-red-200 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-colors">
               Permanently Delete
             </button>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
           <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex justify-between items-center">
             <div>
               <h3 class="font-bold text-[#09033B]">Curriculum Progress</h3>
               <p class="text-sm text-gray-600">View ACE PACEs scores.</p>
             </div>
             <NuxtLink :to="`/admin/paces/${student.id}`" class="bg-white border px-4 py-2 rounded-lg text-sm font-bold shadow-sm">View</NuxtLink>
           </div>
           
           <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 class="font-bold text-gray-800 mb-4">Academic History</h3>
             <div v-if="history.length" class="space-y-4">
                <div v-for="rec in history" :key="rec.session" class="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <p class="font-bold text-gray-900">{{ rec.term }} ({{ rec.session }})</p>
                    <p class="text-xs text-gray-500">{{ rec.class_level }}</p>
                  </div>
                  <NuxtLink :to="`/report/${student.id}?session=${rec.session}&term=${rec.term}`" target="_blank" class="text-blue-600 font-bold text-sm">View Report</NuxtLink>
                </div>
             </div>
             <div v-else class="text-gray-400 text-center py-8">No records found.</div>
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

// Toast Logic
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg; toastType.value = type;
  setTimeout(() => toastMessage.value = '', 3000)
}

// Config
const CLOUD_NAME = 'dkw2vy90z'
const UPLOAD_PRESET = 'tcad_students'
const allClasses = ['Playgroup', 'Nursery 1', 'Nursery 2', 'Reading Readiness', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Graduated']

// State
const { data, pending, refresh, error } = await useFetch('/api/admin/student-details', { params: { id: studentId } })
const student = computed(() => data.value?.student)
const history = computed(() => data.value?.history || [])

const isEditing = ref(false)
const isSubmitting = ref(false)
const uploading = ref(false)
const targetClass = ref('')
const editForm = ref<any>({})

// --- EDIT LOGIC ---
const startEditing = () => {
  // Clone data so we don't mutate the view directly
  editForm.value = JSON.parse(JSON.stringify(student.value))
  // Format DOB for input field (YYYY-MM-DD)
  if (editForm.value.dob) {
    editForm.value.dob = new Date(editForm.value.dob).toISOString().split('T')[0]
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value = {}
}

const generatePin = () => {
  editForm.value.access_code = Math.floor(100000 + Math.random() * 900000).toString()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  
  const file = input.files[0]
  if (file.size > 2 * 1024 * 1024) return showToast('File too large (Max 2MB)', 'error')

  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const res: any = await $fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
    editForm.value.photo_url = res.secure_url
    showToast('Photo uploaded!', 'success')
  } catch (err) {
    showToast('Upload failed', 'error')
  } finally {
    uploading.value = false
  }
}

const saveChanges = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/admin/student-manage', {
      method: 'POST',
      body: { 
        ...editForm.value, 
        id: studentId, // Important: Pass the ID
        action: 'update' 
      }
    })
    showToast('Profile updated successfully', 'success')
    await refresh() // Reload fresh data
    isEditing.value = false
  } catch (err: any) {
    showToast(err.data?.message || 'Update failed', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// --- EXISTING ACTIONS (Move/Delete) ---
const moveStudent = async () => {
  if (!targetClass.value) return
  if (!confirm(`Move student to ${targetClass.value}?`)) return
  try {
    await $fetch('/api/admin/student-manage', { method: 'POST', body: { id: studentId, new_class: targetClass.value, action: 'move' } })
    showToast('Student moved!', 'success'); await refresh(); targetClass.value = ''
  } catch (err) { showToast('Move failed', 'error') }
}

const deleteStudent = async () => {
  if (!confirm('Permanently delete student?')) return
  try {
    await $fetch('/api/admin/student-manage', { method: 'POST', body: { id: studentId, action: 'delete' } })
    router.push('/admin/dashboard')
  } catch (err) { showToast('Delete failed', 'error') }
}
</script>