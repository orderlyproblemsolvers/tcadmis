<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
    <div class="max-w-5xl mx-auto">
      
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-[#09033B] tracking-tight">Access Directory</h1>
          <p class="text-gray-500 mt-1 text-sm">Manage Parent Portal Admission Numbers and PINs.</p>
        </div>
        
        <div class="relative w-full md:w-72">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search name or ID..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#09033B] outline-none shadow-sm"
          />
          <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Admission No.</th>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Access PIN</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-blue-50/30 transition-colors">
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
                  <button @click="togglePin(student.id)" class="text-gray-400 hover:text-[#09033B] transition-colors">
                    <svg v-if="visiblePins.includes(student.id)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredStudents.length === 0" class="p-12 text-center text-gray-400">
          No students found matching your search.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const searchQuery = ref('')
const visiblePins = ref<string[]>([])

// Fetch all students with their access codes
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
</script>