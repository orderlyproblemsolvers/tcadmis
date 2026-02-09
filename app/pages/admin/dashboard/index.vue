<template>
  <div>
    <UiToast />

    <div class="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ activeTab === 'classes' ? 'Class Overview' : 'Teacher Management' }}</h1>
        <p class="text-gray-500 mt-1">
          {{ activeTab === 'classes' ? 'Manage allocations and view student counts' : 'View and edit registered teachers' }}
        </p>
      </div>
      
      <div class="flex space-x-1 bg-gray-200 p-1 rounded-lg">
        <button 
          @click="activeTab = 'classes'"
          :class="['px-4 py-2 text-sm font-medium rounded-md transition-colors', activeTab === 'classes' ? 'bg-white text-[#09033B] shadow' : 'text-gray-500 hover:text-gray-700']"
        >
          Classes
        </button>
        <button 
          @click="activeTab = 'teachers'"
          :class="['px-4 py-2 text-sm font-medium rounded-md transition-colors', activeTab === 'teachers' ? 'bg-white text-[#09033B] shadow' : 'text-gray-500 hover:text-gray-700']"
        >
          Teachers
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'classes'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="cls in data?.classes" :key="cls.class_name" class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 group">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-900">{{ cls.class_name }}</h3>
          <span class="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded border border-blue-100">
            {{ cls.student_count }} Students
          </span>
        </div>
        
        <div class="mb-6">
          <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Class Teacher</p>
          
          <div v-if="cls.teacher_name" class="flex items-center justify-between bg-green-50 px-3 py-2 rounded border border-green-100">
             <div class="flex items-center gap-2">
                 <div class="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                   {{ cls.teacher_name.charAt(0) }}
                 </div>
                 <span class="font-medium text-gray-900 text-sm truncate max-w-[120px]">{{ cls.teacher_name }}</span>
             </div>
             <button 
               @click="removeTeacher(cls.class_name)"
               class="text-red-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
               title="Remove Teacher"
             >
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>

          <div v-else class="text-red-400 text-sm flex items-center gap-1 px-3 py-2 bg-red-50 rounded border border-red-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span class="italic">Unassigned</span>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100 flex justify-between items-center gap-2">
           <select 
             v-if="!cls.teacher_name"
             @change="(e) => assignTeacher(cls.class_name, (e.target as HTMLSelectElement).value)"
             class="text-xs border-gray-300 rounded focus:ring-[#09033B] focus:border-[#09033B] py-1.5 flex-1 cursor-pointer hover:border-blue-500"
           >
             <option value="" disabled selected>Select Teacher...</option>
             <option v-for="t in data?.teachers" :key="t.id" :value="t.id">{{ t.full_name }}</option>
           </select>
           
           <div v-else class="flex-1 text-xs text-gray-400 italic">
             Remove current teacher to reassign.
           </div>
           
           <NuxtLink :to="`/admin/classes/${cls.class_name}`" class="text-[#09033B] hover:bg-gray-50 px-3 py-1.5 rounded text-xs font-bold border border-gray-200 hover:border-[#09033B] transition-all">
             View Class
           </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'teachers'" class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="teacher in data?.teachers" :key="teacher.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ teacher.full_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ teacher.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500"><span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Teacher</span></td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <span class="text-green-600 font-medium">Active</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'admin',
  middleware: 'auth' 
})

defineOgImageComponent('TcadMis', {
  title: 'Admin Dashboard',
  subtitle: 'Overseeing institutional excellence and academic integrity.',
  label: 'Administrator'
})

const activeTab = ref('classes')
const { data, refresh } = await useFetch('/api/admin/dashboard-stats')
const { showToast } = useToast()

const assignTeacher = async (className: string, teacherId: string) => {
  if(!teacherId) return
  try {
    const res: any = await $fetch('/api/admin/assign-class', {
      method: 'POST',
      body: { className, teacherId, action: 'assign' }
    })
    
    await refresh()
    showToast(res.message, 'success')
  } catch (err: any) {
    showToast(err.data?.message || 'Failed to assign teacher', 'error')
    // Reset dropdown if failed (optional, simplest way is to just let refresh handle it or manual DOM reset)
    await refresh() 
  }
}

const removeTeacher = async (className: string) => {
  if(!confirm(`Are you sure you want to remove the teacher from ${className}?`)) return
  
  try {
    await $fetch('/api/admin/assign-class', {
      method: 'POST',
      body: { className, action: 'remove' }
    })
    await refresh()
    showToast('Teacher removed successfully', 'success')
  } catch (err: any) {
    showToast('Failed to remove teacher', 'error')
  }
}
</script>