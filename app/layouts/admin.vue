<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    
    <aside class="w-64 bg-[#09033B] text-white flex flex-col shadow-xl z-20 fixed h-full transition-all duration-300">
      
      <div class="p-6 border-b border-blue-900 flex items-center gap-3">
        <img src="/img/logo.png" alt="TCAD Logo" class="w-8 h-8 object-contain bg-white rounded-sm" />
        <span class="text-xl font-bold tracking-wide">Admin Portal</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        
        <p class="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>

        <NuxtLink 
          to="/admin/dashboard" 
          active-class="bg-blue-800 text-white shadow-md border-r-4 border-blue-400"
          class="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-gray-400 hover:bg-blue-900 hover:text-white mb-1"
        >
          <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 group-hover:text-white transition-colors" />
          <span class="font-medium">Dashboard</span>
        </NuxtLink>

        <NuxtLink 
          to="/admin/register" 
          active-class="bg-blue-800 text-white shadow-md border-r-4 border-blue-400"
          class="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-gray-400 hover:bg-blue-900 hover:text-white mb-1"
        >
          <UIcon name="i-heroicons-user-plus" class="w-5 h-5 group-hover:text-white transition-colors" />
          <span class="font-medium">Registration</span>
        </NuxtLink>

        <NuxtLink 
          to="/admin/staff" 
          active-class="bg-blue-800 text-white shadow-md border-r-4 border-blue-400"
          class="group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-gray-400 hover:bg-blue-900 hover:text-white mb-4"
        >
          <UIcon name="i-heroicons-users" class="w-5 h-5 group-hover:text-white transition-colors" />
          <span class="font-medium">All Staff</span>
        </NuxtLink>

        <div class="border-t border-blue-900/50 my-4 mx-2"></div>

        <div>
          <button 
            @click="isClassesOpen = !isClassesOpen"
            class="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors group text-gray-400 hover:bg-blue-900 hover:text-white"
            :class="{ 'bg-blue-900 text-white': isClassesOpen }"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 transition-colors" :class="isClassesOpen ? 'text-white' : 'group-hover:text-white'" />
              <span class="font-medium">Manage Classes</span>
            </div>
            <UIcon 
              name="i-heroicons-chevron-down" 
              class="w-4 h-4 transition-transform duration-200"
              :class="[isClassesOpen && 'rotate-180']"
            />
          </button>

          <div v-show="isClassesOpen" class="mt-1 space-y-1">
            <div v-if="classes.length === 0" class="px-8 py-2 text-xs text-gray-500 italic">No classes found</div>
            
            <NuxtLink 
              v-for="cls in classes" 
              :key="cls.class_name"
              :to="`/admin/classes/${cls.class_name}`"
              active-class="text-blue-300 bg-blue-900/40 border-l-2 border-blue-400 pl-10"
              class="block pl-12 pr-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-blue-900/30 rounded-r-lg transition-all"
            >
              {{ cls.class_name }}
            </NuxtLink>
          </div>
        </div>

      </nav>

      <div class="p-4 border-t border-blue-900 bg-[#07022e]">
        <button @click="logout" class="w-full flex items-center justify-center gap-2 text-red-300 hover:text-white hover:bg-red-900/30 py-2.5 rounded transition-colors duration-200 group">
           <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 group-hover:text-red-400" />
           <span class="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 ml-64 overflow-y-auto bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
const { clear } = useUserSession()
const router = useRouter()

const isClassesOpen = ref(true) // Default to open for better discovery

// Fetch classes once for the sidebar navigation
// We use a specific key to avoid re-fetching on every page load unless necessary
const { data } = await useFetch('/api/admin/dashboard-stats', { key: 'sidebar-stats' })
const classes = computed(() => data.value?.classes || [])

const logout = async () => {
  await clear()
  router.push('/login')
}
</script>

<style scoped>
/* Custom Scrollbar for Sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #1e3a8a;
  border-radius: 20px;
}
</style>