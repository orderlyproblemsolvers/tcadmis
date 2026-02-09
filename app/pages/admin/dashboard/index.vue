<template>
  <div class="space-y-6">
    <UiToast />

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
      <div>
        <h1 class="text-3xl font-black text-[#09033B] ">Academic Overview</h1>
        <p class="text-gray-500 mt-1">Manage class allocations and staff assignments.</p>
        
        <div class="flex gap-3 mt-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <span class="font-bold mr-1">{{ stats.totalStudents }}</span> Students
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <span class="font-bold mr-1">{{ stats.totalClasses }}</span> Classes
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="stats.unassignedCount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
            {{ stats.unassignedCount }} Unassigned Classes
          </span>
        </div>
      </div>

      <div class="bg-gray-100 p-1 rounded-lg flex self-start md:self-auto">
        <button 
          v-for="tab in ['classes', 'teachers']" 
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2 text-sm font-medium rounded-md transition-all capitalize"
          :class="activeTab === tab ? 'bg-white text-[#09033B] shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'classes'" class="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="relative w-full sm:w-72">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <UIcon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-400" />
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search classes..." 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#09033B] focus:border-[#09033B] sm:text-sm"
        />
        <button 
          v-if="searchQuery" 
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <UIcon name="i-heroicons-x-mark" class="h-4 w-4" />
        </button>
      </div>

      <div class="flex gap-2">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-3 py-1 text-xs font-semibold rounded-full border transition-colors"
          :class="activeFilter === filter.value 
            ? 'bg-[#09033B] text-white border-[#09033B]' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'classes'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <TransitionGroup name="list">
        <div 
          v-for="cls in filteredClasses" 
          :key="cls.class_name"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 group relative"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ cls.class_name }}</h3>
              <p class="text-xs text-gray-500 font-medium mt-1">
                {{ cls.student_count }} Students Enrolled
              </p>
            </div>
            <div class="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div class="space-y-4">
            <div v-if="cls.teacher_name" class="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-[#09033B] text-white flex items-center justify-center text-xs font-bold">
                  {{ cls.teacher_name.charAt(0) }}
                </div>
                <div class="flex flex-col">
                  <span class="text-[10px] text-green-700 font-bold uppercase tracking-wider">Class Teacher</span>
                  <span class="text-sm font-semibold text-gray-900 truncate max-w-[120px]" :title="cls.teacher_name">
                    {{ cls.teacher_name }}
                  </span>
                </div>
              </div>
              
              <button 
                @click="removeTeacher(cls.class_name)"
                :disabled="loadingState[cls.class_name]"
                class="text-red-400 hover:text-red-600 hover:bg-red-100 rounded p-1 transition-colors disabled:opacity-50"
                title="Remove Teacher"
              >
                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
              </button>
            </div>

            <div v-else class="space-y-3">
              <div class="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded text-xs font-bold border border-amber-100">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                <span>No Teacher Assigned</span>
              </div>
              
              <div class="relative">
                <select 
                  class="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-[#09033B] focus:border-[#09033B] rounded-md disabled:bg-gray-100 disabled:cursor-wait"
                  @change="(e) => assignTeacher(cls.class_name, (e.target as HTMLSelectElement).value)"
                  :disabled="loadingState[cls.class_name]"
                >
                  <option value="" disabled selected>Select Teacher...</option>
                  <option v-for="t in data?.teachers" :key="t.id" :value="t.id">{{ t.full_name }}</option>
                </select>
                <div v-if="loadingState[cls.class_name]" class="absolute inset-y-0 right-8 flex items-center">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="filteredClasses.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
        <div class="bg-gray-100 p-4 rounded-full mb-3">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8" />
        </div>
        <p>No classes match your filter.</p>
        <button class="mt-2 text-[#09033B] font-medium hover:underline" @click="clearFilters">Clear Filters</button>
      </div>
    </div>

    <div v-if="activeTab === 'teachers'" class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="teacher in data?.teachers" :key="teacher.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                  {{ teacher.full_name.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ teacher.full_name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ teacher.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Teacher</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <span class="text-green-600">Active</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ensure Admin Layout is used
definePageMeta({ 
  layout: 'admin',
})

// Optional OG Image
defineOgImageComponent('TcadMis', {
  title: 'Admin Dashboard',
  subtitle: 'Overseeing institutional excellence and academic integrity.',
  label: 'Administrator'
})

const activeTab = ref('classes')
const searchQuery = ref('')
const activeFilter = ref('all')
const loadingState = ref<Record<string, boolean>>({})

// Fetch Data
const { data, refresh } = await useFetch('/api/admin/dashboard-stats')
const { showToast } = useToast() // Assuming you have a composable for toasts

// --- FILTERS & COMPUTED LOGIC ---

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Unassigned', value: 'unassigned' }
]

const stats = computed(() => {
  const classes = data.value?.classes || []
  return {
    totalClasses: classes.length,
    // Fix: Wrap c.student_count in Number() to force math addition
    totalStudents: classes.reduce((sum: number, c: any) => sum + Number(c.student_count || 0), 0),
    unassignedCount: classes.filter((c: any) => !c.teacher_name).length
  }
})

const filteredClasses = computed(() => {
  let result = data.value?.classes || []

  // 1. Text Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((c: any) => 
      c.class_name.toLowerCase().includes(q) || 
      (c.teacher_name && c.teacher_name.toLowerCase().includes(q))
    )
  }

  // 2. Status Filter
  if (activeFilter.value === 'assigned') {
    result = result.filter((c: any) => c.teacher_name)
  } else if (activeFilter.value === 'unassigned') {
    result = result.filter((c: any) => !c.teacher_name)
  }

  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  activeFilter.value = 'all'
}

// --- ACTIONS ---

const assignTeacher = async (className: string, teacherId: string) => {
  if (!teacherId) return
  loadingState.value[className] = true
  
  try {
    const res: any = await $fetch('/api/admin/assign-class', {
      method: 'POST',
      body: { className, teacherId, action: 'assign' }
    })
    await refresh()
    showToast(res.message, 'success')
  } catch (err: any) {
    showToast(err.data?.message || 'Assignment failed', 'error')
    // Refresh to reset the select dropdown visually if failed
    await refresh()
  } finally {
    loadingState.value[className] = false
  }
}

const removeTeacher = async (className: string) => {
  if (!confirm(`Are you sure you want to remove the teacher from ${className}?`)) return
  
  loadingState.value[className] = true
  try {
    await $fetch('/api/admin/assign-class', {
      method: 'POST',
      body: { className, action: 'remove' }
    })
    await refresh()
    showToast('Teacher unassigned successfully', 'success')
  } catch (err: any) {
    showToast('Failed to remove teacher', 'error')
  } finally {
    loadingState.value[className] = false
  }
}
</script>

<style scoped>
/* List Transition for smoother filtering */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.list-leave-active {
  position: absolute;
}
</style>