<template>
  <div class="relative p-4 md:p-8 max-w-7xl mx-auto font-sans">
    
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

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-[#09033B] tracking-tight">Staff Directory</h1>
        <p class="text-gray-500 mt-1">Manage {{ filteredStaff.length }} staff members.</p>
      </div>
      
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-64">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 absolute left-3 top-3 text-gray-400">
             <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
           </svg>
           <input 
             v-model="searchQuery" 
             type="text" 
             placeholder="Search name or email..." 
             class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#09033B] focus:ring-2 focus:ring-[#09033B]/20 outline-none text-sm shadow-sm transition-all"
           />
        </div>
        <NuxtLink to="/admin/register" class="bg-[#09033B] text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-900 text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          <span class="hidden sm:inline">Add Staff</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="text-center py-20">
       <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#09033B] mx-auto"></div>
    </div>

    <div v-else-if="filteredStaff.length === 0" class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-300 mx-auto mb-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
      <h3 class="text-lg font-bold text-gray-900 tracking-tight">No staff found</h3>
      <p class="text-gray-400 text-sm">Try adjusting your search criteria.</p>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50 text-left">
            <tr>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Identity</th>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
              <th class="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Qualification</th>
              <th class="relative px-6 py-4"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr 
              v-for="staff in filteredStaff" 
              :key="staff.id" 
              class="hover:bg-blue-50/30 transition-all cursor-pointer group"
              @click="openEdit(staff)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-11 w-11 rounded-full border-2 border-white shadow-sm overflow-hidden bg-[#09033B]">
                    <img v-if="staff.photo_url" :src="staff.photo_url" class="h-full w-full object-cover" />
                    <div v-else class="h-full w-full flex items-center justify-center text-white font-black text-sm uppercase">
                      {{ staff.full_name.charAt(0) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-black text-gray-900 group-hover:text-[#09033B] transition-colors">{{ staff.full_name }}</div>
                    <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-1">{{ staff.role }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ staff.email }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ staff.phone || '--' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="staff.qualification" class="px-2.5 py-1 text-[10px] font-black rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                  {{ staff.qualification }}
                </span>
                <span v-else class="text-gray-300 text-xs italic">Not set</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                 <button @click="openEdit(staff)" class="text-gray-400 hover:text-[#09033B] p-2 rounded-lg hover:bg-gray-100 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="showEditModal = false"></div>

      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
            <div>
              <h3 class="text-xl font-black text-[#09033B] tracking-tight">Edit Staff Profile</h3>
              <p class="text-xs text-gray-500">Update system access and bio-data.</p>
            </div>
            <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 md:p-8 overflow-y-auto">
            <form id="edit-form" @submit.prevent="updateStaff" class="space-y-8">
              
              <div class="flex flex-col sm:flex-row gap-8">
                <div class="w-full sm:w-1/3 flex flex-col items-center text-center">
                   <div class="h-28 w-28 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mb-4">
                      <img v-if="editingStaff.photo_url" :src="editingStaff.photo_url" class="h-full w-full object-cover" />
                      <span v-else class="text-4xl font-black text-gray-200">{{ editingStaff.full_name?.charAt(0) }}</span>
                   </div>
                   <p class="text-[10px] text-gray-400 font-bold uppercase leading-tight bg-gray-100 p-2 rounded-lg">Photo Locked<br>Re-register to change image</p>
                </div>

                <div class="w-full sm:w-2/3 space-y-5">
                   <div>
                      <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input v-model="editingStaff.full_name" class="w-full border border-gray-200 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#09033B]/10 focus:border-[#09033B] outline-none transition-all" required />
                   </div>
                   <div>
                      <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Email (Login ID)</label>
                      <input v-model="editingStaff.email" type="email" class="w-full border border-gray-200 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#09033B]/10 focus:border-[#09033B] outline-none transition-all" required />
                   </div>
                   <div class="grid grid-cols-2 gap-4">
                      <div>
                         <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                         <input v-model="editingStaff.phone" class="w-full border border-gray-200 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#09033B]/10 focus:border-[#09033B] outline-none" />
                      </div>
                      <div>
                         <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Qualification</label>
                         <select v-model="editingStaff.qualification" class="w-full border border-gray-200 p-3 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-[#09033B]/10 focus:border-[#09033B] outline-none">
                           <option>NCE</option><option>B.Ed</option><option>B.Sc</option><option>M.Sc</option><option>PhD</option><option>SSCE</option>
                         </select>
                      </div>
                   </div>
                </div>
              </div>

              <div class="bg-[#09033B]/5 p-5 rounded-2xl border border-[#09033B]/10">
                 <h4 class="text-xs font-black text-[#09033B] uppercase tracking-widest mb-4 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 1 00-16 8 8 0 0 00 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clip-rule="evenodd" />
                   </svg>
                   Guarantor Details
                 </h4>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                       <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Full Name</label>
                       <input v-model="editingStaff.guarantor_name" class="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-white focus:border-[#09033B] outline-none" />
                    </div>
                    <div>
                       <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Phone</label>
                       <input v-model="editingStaff.guarantor_phone" class="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-white focus:border-[#09033B] outline-none" />
                    </div>
                    <div>
                       <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Relationship</label>
                       <input v-model="editingStaff.guarantor_rel" class="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-white focus:border-[#09033B] outline-none" />
                    </div>
                 </div>
              </div>
            </form>
          </div>

          <div class="px-6 py-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0 z-10">
            <button type="button" @click="handleDelete(editingStaff)" class="w-full sm:w-auto text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all border border-transparent hover:border-red-100">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                 <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
               </svg>
               Delete Account
            </button>
            <div class="flex gap-3 w-full sm:w-auto">
               <button @click="showEditModal = false" class="flex-1 sm:flex-none px-6 py-2.5 text-gray-500 hover:text-gray-900 font-bold text-sm transition-all border border-gray-200 rounded-xl hover:bg-white active:scale-95">Cancel</button>
               <button type="submit" form="edit-form" :disabled="isSubmitting" class="flex-1 sm:flex-none bg-[#09033B] text-white px-8 py-2.5 rounded-xl shadow-lg hover:bg-blue-900 font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                  <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

// --- UI STATE ---
const searchQuery = ref('')
const showEditModal = ref(false)
const isSubmitting = ref(false)
const editingStaff = ref<any>({})

// Toast Logic
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

// --- DATA FETCHING ---
const { data: staffList, pending, refresh } = await useFetch('/api/admin/teachers', {
  transform: (data: any) => data || []
})

// Search Filtering
const filteredStaff = computed(() => {
  if (!searchQuery.value) return staffList.value
  const lowerQuery = searchQuery.value.toLowerCase()
  return staffList.value.filter((s: any) => 
    s.full_name.toLowerCase().includes(lowerQuery) || 
    s.email.toLowerCase().includes(lowerQuery)
  )
})

// --- ACTIONS ---
const openEdit = (staff: any) => {
  editingStaff.value = { ...staff }
  showEditModal.value = true
}

const updateStaff = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/admin/staff-manage', {
      method: 'POST',
      body: { action: 'update', ...editingStaff.value }
    })
    showToast('Staff profile updated successfully', 'success')
    showEditModal.value = false
    refresh()
  } catch (e: any) {
    showToast(e.data?.message || 'Update failed', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (staff: any) => {
  if (!confirm(`Are you sure you want to PERMANENTLY delete ${staff.full_name}?`)) return

  isSubmitting.value = true
  try {
    await $fetch('/api/admin/staff-manage', {
      method: 'POST',
      body: { action: 'delete', id: staff.id }
    })
    
    showToast('Staff member deleted', 'success')
    
    // Refresh UI
    showEditModal.value = false
    await refresh()
    
  } catch (e: any) {
    showToast(e.data?.message || 'Failed to delete staff', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>