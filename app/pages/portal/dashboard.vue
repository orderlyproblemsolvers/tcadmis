<template>
  <div class="min-h-screen bg-gray-50 font-sans pb-12">
    <nav class="bg-[#09033B] text-white p-4 shadow-lg sticky top-0 z-40">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white">
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.94 49.94 0 0 0-9.945 2.577l-1.954.51a.75.75 0 0 1-.303 0l-1.954-.51a49.94 49.94 0 0 0-9.945-2.577.75.75 0 0 1-.231-1.337A60.65 60.65 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-2.041c.074.453.114.92.114 1.394 0 4.19-2.008 7.82-5.118 10.033a.75.75 0 0 1-.9.045 10.23 10.23 0 0 1-1.033-.794 10.23 10.23 0 0 1-1.033.794.75.75 0 0 1-.9-.045 12.039 12.039 0 0 1-5.118-10.033c0-.474.04-.941.114-1.394a48.45 48.45 0 0 1 7.666 2.041.75.75 0 0 0 .528 0Z" />
             </svg>
          </div>
          <h1 class="font-black text-xl tracking-tight hidden sm:block">TCAD Parent Portal</h1>
        </div>
        <button @click="handleLogout" class="text-xs font-bold bg-white/10 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-2">
          Logout
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto p-4 md:p-8">
      
      <div v-if="student" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div class="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md overflow-hidden flex-shrink-0">
          <img v-if="student.photo_url" :src="student.photo_url" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-3xl font-black text-[#09033B] uppercase bg-[#09033B]/5">
            {{ student.first_name[0] }}{{ student.last_name[0] }}
          </div>
        </div>
        <div class="text-center md:text-left flex-1">
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">{{ student.first_name }} {{ student.last_name }}</h2>
          <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <span class="bg-blue-50 text-[#09033B] text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              {{ student.admission_number }}
            </span>
            <span class="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
              Class: {{ student.class_level }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex bg-gray-200/50 p-1.5 rounded-xl w-full sm:w-max mb-8 border border-gray-200">
        <button 
          @click="activeTab = 'results'"
          class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
          :class="activeTab === 'results' ? 'bg-white text-[#09033B] shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Reports
        </button>
        <button 
          @click="activeTab = 'paces'"
          class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
          :class="activeTab === 'paces' ? 'bg-white text-[#09033B] shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
          PACE Progress
        </button>
      </div>

      <div v-if="activeTab === 'results'" class="space-y-4">
        <div v-if="history.length === 0" class="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-300 mx-auto mb-4">
             <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
           </svg>
           <p class="text-gray-400 font-medium">No results found for this student yet.</p>
        </div>

        <div v-for="rec in history" :key="`${rec.session}-${rec.term}`" class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between group hover:border-[#09033B] transition-all">
          <div class="flex items-center gap-4">
            <div class="bg-blue-50 text-[#09033B] font-black w-12 h-12 rounded-lg flex flex-col items-center justify-center border border-blue-100">
               <span class="text-[8px] uppercase opacity-60">Sess</span>
               <span class="text-xs">{{ rec.session.split('/')[0] }}</span>
            </div>
            <div>
              <h4 class="font-black text-gray-900 leading-tight">{{ rec.term }} Report</h4>
              <p class="text-xs text-gray-500 mt-1">Class: {{ rec.class_level }}</p>
            </div>
          </div>
          <NuxtLink 
            :to="`/report/${student.id}?session=${rec.session}&term=${rec.term}`" 
            target="_blank"
            class="bg-white border border-gray-200 text-[#09033B] px-5 py-2.5 rounded-lg text-xs font-black hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path d="M10 12.5a2.5 2.5 0 1 00-5 2.5 2.5 0 0 00 5Z" />
              <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            View PDF
          </NuxtLink>
        </div>
      </div>

      <div v-if="activeTab === 'paces'">
        <PaceTracker :student-id="student.id" mode="admin" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// Ensure parent layout is used (or just 'default')
defineOgImageComponent('TcadMis', {
  title: 'Parent Portal',
  subtitle: 'Academic Excellence & Godly Education',
  label: 'Parent'
})

const router = useRouter()
const activeTab = ref('results')

// Fetch data from the dashboard endpoint (which we'll create next)
const { data, error, pending } = await useFetch('/api/portal/dashboard-data')

// Security check: If not logged in or token expired, redirect to portal login
watchEffect(() => {
  if (error.value && error.value.statusCode === 401) {
    router.push('/portal/login')
  }
})

const student = computed(() => data.value?.student)
const history = computed(() => data.value?.history || [])

const handleLogout = () => {
  const token = useCookie('parent_token')
  token.value = null
  router.push('/portal/login')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>