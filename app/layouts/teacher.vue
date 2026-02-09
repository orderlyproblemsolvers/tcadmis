<template>
  <div class="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
    
    <header class="bg-[#09033B] text-white p-4 flex justify-between items-center md:hidden sticky top-0 z-30 shadow-md">
      <div class="flex items-center gap-3">
        <button @click="isSidebarOpen = true" class="text-white focus:outline-none">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div class="flex items-center gap-2">
          <img src="/img/logo.png" alt="TCAD Logo" class="w-8 h-8 object-contain bg-white rounded-sm" />
          <span class="font-bold tracking-wide">Teacher Portal</span>
        </div>
      </div>
    </header>

    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
    ></div>

    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-[#09033B] text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:h-screen md:sticky md:top-0'
      ]"
    >
      <div class="p-6 border-b border-blue-900 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/img/logo.png" alt="TCAD Logo" class="w-8 h-8 object-contain bg-white rounded-sm" />
          <span class="text-xl font-bold tracking-wide">Teacher Portal</span>
        </div>
        <button @click="isSidebarOpen = false" class="md:hidden text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        
        <NuxtLink 
          to="/teacher/dashboard" 
          active-class="bg-blue-800 text-white shadow"
          class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-gray-300 hover:bg-blue-900 hover:text-white mb-4"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span class="font-medium">Overview</span>
        </NuxtLink>

        <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Classes</p>
        
        <div v-if="pending" class="px-4 text-sm text-gray-500">Loading classes...</div>
        
        <div v-else-if="classes.length === 0" class="px-4 text-sm text-yellow-400 italic">
          No classes assigned.
        </div>

        <ul v-else class="space-y-1">
           <li v-for="cls in classes" :key="cls.class_name">
             <NuxtLink 
               :to="`/teacher/class/${cls.class_name}`"
               active-class="bg-blue-800 text-white shadow border-r-4 border-blue-400"
               class="flex items-center justify-between px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-blue-900 transition-colors"
             >
               <span class="font-medium">{{ cls.class_name }}</span>
               <span class="bg-blue-900 text-blue-200 text-xs py-0.5 px-2 rounded-full">{{ cls.student_count }}</span>
             </NuxtLink>
           </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-blue-900 bg-[#07022e]">
        <div class="flex items-center gap-3 mb-4 px-2">
          <div class="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-xs font-bold">
            {{ user?.full_name?.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-bold truncate">{{ user?.full_name }}</p>
            <p class="text-xs text-gray-400">Teacher</p>
          </div>
        </div>
        <button @click="logout" class="w-full flex items-center justify-center gap-2 text-red-300 hover:text-white hover:bg-red-600 py-2 rounded transition-colors text-sm font-bold">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           Sign Out
        </button>
      </div>
    </aside>

    <main class="flex-1 w-full md:w-auto bg-gray-50 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession()
const router = useRouter()
const route = useRoute()

// State for Mobile Sidebar Toggle
const isSidebarOpen = ref(false)

// Automatically close sidebar when route changes (on mobile)
watch(() => route.fullPath, () => {
  isSidebarOpen.value = false
})

// Fetch classes for sidebar
const { data, pending } = await useFetch('/api/teacher/my-classes')
const classes = computed(() => data.value?.classes || [])

const logout = async () => {
  await clear()
  router.push('/login')
}
</script>