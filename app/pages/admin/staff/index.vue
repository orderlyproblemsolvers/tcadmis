<template>
  <div class="p-8 max-w-7xl mx-auto">
    <UNotifications />

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-[#09033B]">Staff Directory</h1>
        <p class="text-gray-500 mt-1">Manage {{ filteredStaff.length }} staff members.</p>
      </div>
      
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-64">
           <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
           <input 
             v-model="searchQuery" 
             type="text" 
             placeholder="Search name or email..." 
             class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-[#09033B] focus:ring-1 focus:ring-[#09033B] text-sm"
           />
        </div>
        <NuxtLink to="/admin/register" class="bg-[#09033B] text-white px-4 py-2 rounded-lg shadow hover:bg-opacity-90 text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95">
          <UIcon name="i-heroicons-plus" class="w-5 h-5" /> 
          <span class="hidden sm:inline">Add Staff</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="text-center py-20">
       <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#09033B] mx-auto"></div>
    </div>

    <div v-else-if="filteredStaff.length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <UIcon name="i-heroicons-user-minus" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <h3 class="text-lg font-medium text-gray-900">No staff found</h3>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Identity</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Qualification</th>
              <th class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr 
              v-for="staff in filteredStaff" 
              :key="staff.id" 
              class="hover:bg-blue-50/50 transition-colors cursor-pointer group"
              @click="openEdit(staff)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img v-if="staff.photo_url" :src="staff.photo_url" class="h-10 w-10 rounded-full object-cover border border-gray-200" />
                    <div v-else class="h-10 w-10 rounded-full bg-[#09033B] text-white flex items-center justify-center font-bold text-sm">
                      {{ staff.full_name.charAt(0) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-gray-900 group-hover:text-blue-700">{{ staff.full_name }}</div>
                    <div class="text-xs text-gray-500 bg-gray-100 px-1.5 rounded inline-block mt-0.5 capitalize">{{ staff.role }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.email }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ staff.phone || 'No phone' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="staff.qualification" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">{{ staff.qualification }}</span>
                <span v-else class="text-gray-400 text-xs italic">--</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                <UDropdown :items="getActionItems(staff)" :ui="{ width: 'w-48' }">
                  <button class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                    <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5" />
                  </button>
                </UDropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showEditModal" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm" @click="showEditModal = false"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          
          <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl flex flex-col max-h-[90vh]">
            
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 class="text-lg font-bold text-gray-900">Edit Staff Profile</h3>
              <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
                <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
              </button>
            </div>

            <div class="p-6 overflow-y-auto">
              <form id="edit-form" @submit.prevent="updateStaff" class="space-y-6">
                
                <div class="flex flex-col sm:flex-row gap-6">
                  <div class="w-full sm:w-1/3 flex flex-col items-center text-center">
                     <div class="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md mb-3">
                        <img v-if="editingStaff.photo_url" :src="editingStaff.photo_url" class="h-full w-full object-cover" />
                        <span v-else class="text-3xl font-bold text-gray-400">{{ editingStaff.full_name?.charAt(0) }}</span>
                     </div>
                     <p class="text-[10px] text-gray-500 leading-tight">Profile photos cannot be changed here. Please re-register if a new photo is required.</p>
                  </div>

                  <div class="w-full sm:w-2/3 space-y-4">
                     <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                        <input v-model="editingStaff.full_name" class="w-full border border-gray-300 p-2 rounded text-sm focus:border-[#09033B] focus:ring-1 focus:ring-[#09033B] outline-none" required />
                     </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Email (Login)</label>
                        <input v-model="editingStaff.email" type="email" class="w-full border border-gray-300 p-2 rounded text-sm focus:border-[#09033B] focus:ring-1 focus:ring-[#09033B] outline-none" required />
                     </div>
                     <div class="grid grid-cols-2 gap-3">
                        <div>
                           <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                           <input v-model="editingStaff.phone" class="w-full border border-gray-300 p-2 rounded text-sm focus:border-[#09033B] focus:ring-1 focus:ring-[#09033B] outline-none" />
                        </div>
                        <div>
                           <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Qualification</label>
                           <select v-model="editingStaff.qualification" class="w-full border border-gray-300 p-2 rounded text-sm bg-white outline-none focus:border-[#09033B]">
                             <option>NCE</option><option>B.Ed</option><option>B.Sc</option><option>M.Sc</option><option>PhD</option><option>SSCE</option>
                           </select>
                        </div>
                     </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                        <textarea v-model="editingStaff.address" rows="2" class="w-full border border-gray-300 p-2 rounded text-sm focus:border-[#09033B] focus:ring-1 focus:ring-[#09033B] outline-none"></textarea>
                     </div>
                  </div>
                </div>

                <div class="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                   <h4 class="text-xs font-bold text-[#09033B] uppercase mb-3">Guarantor Details</h4>
                   <div class="space-y-3">
                      <div>
                         <label class="block text-[10px] font-bold text-gray-500 mb-1">FULL NAME</label>
                         <input v-model="editingStaff.guarantor_name" class="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:border-[#09033B] outline-none" />
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                           <label class="block text-[10px] font-bold text-gray-500 mb-1">PHONE</label>
                           <input v-model="editingStaff.guarantor_phone" class="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:border-[#09033B] outline-none" />
                        </div>
                        <div>
                           <label class="block text-[10px] font-bold text-gray-500 mb-1">RELATIONSHIP</label>
                           <input v-model="editingStaff.guarantor_rel" class="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:border-[#09033B] outline-none" />
                        </div>
                      </div>
                   </div>
                </div>

              </form>
            </div>

            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center sticky bottom-0 z-10">
              <button type="button" @click="deleteStaff(editingStaff)" class="text-red-600 hover:bg-red-50 px-3 py-2 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                 <UIcon name="i-heroicons-trash" class="w-4 h-4" /> Delete Account
              </button>
              <div class="flex gap-3">
                 <button @click="showEditModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors border border-gray-300 rounded hover:bg-white">Cancel</button>
                 <button type="submit" form="edit-form" :disabled="isSubmitting" class="bg-[#09033B] text-white px-6 py-2 rounded shadow hover:bg-opacity-90 font-bold text-sm transition-colors flex items-center gap-2">
                    <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                 </button>
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
const toast = useToast()

const searchQuery = ref('')
const showEditModal = ref(false)
const isSubmitting = ref(false)
const editingStaff = ref<any>({})

// Fetch Staff List
const { data: staffList, pending, refresh } = await useFetch('/api/admin/teachers', {
  transform: (data: any) => data || []
})

// Search Logic
const filteredStaff = computed(() => {
  if (!searchQuery.value) return staffList.value
  const lowerQuery = searchQuery.value.toLowerCase()
  return staffList.value.filter((s: any) => 
    s.full_name.toLowerCase().includes(lowerQuery) || 
    s.email.toLowerCase().includes(lowerQuery)
  )
})

// Dropdown Actions Config
const getActionItems = (staff: any) => [
  [{
      label: 'Edit Profile',
      icon: 'i-heroicons-pencil-square',
      click: () => openEdit(staff)
  }],
  [{
      label: 'Delete Staff',
      icon: 'i-heroicons-trash',
      class: 'text-red-600',
      click: () => deleteStaff(staff)
  }]
]

// --- ACTIONS ---
const deleteStaff = async (staff: any) => {
  if (!confirm(`Are you sure you want to delete ${staff.full_name}? This cannot be undone.`)) return;
  isSubmitting.value = true
  try {
    await $fetch('/api/admin/staff-manage', {
      method: 'POST',
      body: { action: 'delete', id: staff.id }
    })
    toast.add({ title: 'Staff Deleted', color: 'green' })
    showEditModal.value = false
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Error', description: e.message, color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}

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
    toast.add({ title: 'Profile Updated', color: 'green' })
    showEditModal.value = false
    refresh()
  } catch (e: any) {
    toast.add({ title: 'Update Failed', description: e.message, color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}
</script>