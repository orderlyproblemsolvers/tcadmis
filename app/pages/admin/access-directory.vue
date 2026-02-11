<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
    <div class="max-w-5xl mx-auto">
      
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-[#09033B] tracking-tight">Access Directory</h1>
          <p class="text-gray-500 mt-1 text-sm">Manage Parent Portal Admission Numbers and PINs.</p>
        </div>
        
        <div class="relative w-full md:w-72">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search name or ID..."
            class="w-full pl-10 pr-4 py-3 md:py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#09033B] outline-none shadow-sm"
          />
          <svg class="absolute left-3 top-3.5 md:top-3 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Admission No.</th>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Access PIN</th>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-blue-50/30 transition-colors group">
              <td class="px-6 py-4">
                <div class="font-bold text-gray-900">{{ student.first_name }} {{ student.last_name }}</div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">{{ student.class_level }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-600">
                  {{ student.admission_number }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <span 
                    class="font-mono text-lg font-black tracking-widest"
                    :class="visiblePins.includes(student.id) ? 'text-[#09033B]' : 'text-gray-200'"
                  >
                    {{ visiblePins.includes(student.id) ? student.access_code : '******' }}
                  </span>
                  <button @click="togglePin(student.id)" class="text-gray-400 hover:text-[#09033B]">
                    <UIcon :name="visiblePins.includes(student.id) ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-4 h-4" />
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="copyToClipboard(student)" 
                  class="opacity-0 group-hover:opacity-100 text-xs font-bold text-blue-600 hover:text-blue-800 transition-all flex items-center gap-1 justify-end ml-auto"
                >
                  <UIcon name="i-heroicons-clipboard-document" class="w-4 h-4" />
                  Copy Info
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden space-y-4">
        <div v-for="student in filteredStudents" :key="student.id" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="font-bold text-gray-900">{{ student.first_name }} {{ student.last_name }}</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ student.class_level }}</div>
            </div>
            <button @click="copyToClipboard(student)" class="p-2 bg-blue-50 text-[#09033B] rounded-lg">
              <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-gray-50 pb-2">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Admission No.</span>
              <span class="font-mono text-sm font-bold text-gray-700">{{ student.admission_number }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Access PIN</span>
              <div class="flex items-center gap-3">
                <span class="font-mono text-lg font-black tracking-widest" :class="visiblePins.includes(student.id) ? 'text-[#09033B]' : 'text-gray-200'">
                  {{ visiblePins.includes(student.id) ? student.access_code : '******' }}
                </span>
                <button @click="togglePin(student.id)" class="text-gray-400">
                  <UIcon :name="visiblePins.includes(student.id) ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredStudents.length === 0" class="p-12 text-center text-gray-400">
        No students found matching your search.
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const searchQuery = ref('')
const visiblePins = ref<string[]>([])
const toast = useToast() // Requires @nuxt/ui toast module

const { data: students } = await useFetch('/api/admin/all-access-codes')

const filteredStudents = computed(() => {
  if (!students.value) return []
  const q = searchQuery.value.toLowerCase()
  return students.value.filter(s => 
    s.first_name.toLowerCase().includes(q) || 
    s.last_name.toLowerCase().includes(q) || 
    s.admission_number.toLowerCase().includes(q)
  )
})

const togglePin = (id: string) => {
  if (visiblePins.value.includes(id)) {
    visiblePins.value = visiblePins.value.filter(x => x !== id)
  } else {
    visiblePins.value.push(id)
  }
}

const copyToClipboard = async (student: any) => {
  const text = `TCA Parent Portal Access\nStudent: ${student.first_name} ${student.last_name}\nAdm No: ${student.admission_number}\nPIN: ${student.access_code}`
  
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      title: 'Copied to Clipboard',
      description: `Access info for ${student.first_name} is ready to share.`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  } catch (err) {
    alert('Failed to copy. Please copy manually.')
  }
}
</script>