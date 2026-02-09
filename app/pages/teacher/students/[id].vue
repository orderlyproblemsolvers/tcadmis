<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
    
    <div class="max-w-6xl mx-auto mb-6 md:mb-10">
      <div class="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-3">
        <NuxtLink to="/teacher/dashboard" class="hover:text-[#09033B] transition-colors">Dashboard</NuxtLink>
        <span class="text-gray-300">/</span>
        <NuxtLink v-if="student" :to="`/teacher/class/${student.class_level}`" class="hover:text-[#09033B] transition-colors font-medium">
          {{ student.class_level }}
        </NuxtLink>
        <span v-else>...</span>
        <span class="text-gray-300">/</span>
        <span class="text-gray-900 font-bold truncate">Student Profile</span>
      </div>
      
      <div class="flex items-center justify-between">
        <h1 class="text-2xl md:text-3xl font-black text-[#09033B] tracking-tight">Student Details</h1>
      </div>
    </div>

    <div v-if="pending" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#09033B]"></div>
      <p class="mt-4 text-gray-400 text-sm font-medium animate-pulse">Loading profile...</p>
    </div>

    <div v-else-if="error" class="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-500 text-center">
      <div class="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">Access Denied</h3>
      <p class="text-gray-500 text-sm mb-6">{{ error.message || 'Unable to load student data.' }}</p>
      <NuxtLink to="/teacher/dashboard" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#09033B] hover:bg-blue-900 transition-colors">
        Return to Dashboard
      </NuxtLink>
    </div>

    <div v-else-if="student" class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
      
      <div class="md:col-span-4 lg:col-span-4 space-y-6">
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
          <div class="bg-[#09033B] h-28 w-full relative overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          <div class="absolute top-14 left-1/2 transform -translate-x-1/2">
            <div class="w-28 h-28 bg-white rounded-full p-1.5 shadow-xl">
              <img 
                v-if="student.photo_url" 
                :src="student.photo_url" 
                alt="Student Photo"
                class="w-full h-full object-cover rounded-full border border-gray-100" 
              />
              <div v-else class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-black text-[#09033B] uppercase">
                {{ student.first_name.charAt(0) }}{{ student.last_name.charAt(0) }}
              </div>
            </div>
          </div>

          <div class="pt-16 pb-6 px-6 text-center mt-2">
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ student.last_name }}, {{ student.first_name }}</h2>
            
            <div class="flex flex-wrap justify-center gap-2 mt-3 mb-6">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {{ student.admission_number }}
              </span>
              <span v-if="student.special_needs" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                <UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1" /> Special Needs
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-left">
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Class</p>
                <p class="text-sm font-bold text-[#09033B]">{{ student.class_level }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Gender</p>
                <p class="text-sm font-bold text-gray-900 capitalize">{{ student.gender }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date of Birth</p>
                <p class="text-sm font-medium text-gray-700">{{ student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Guardian Information</h4>
          
          <div v-if="student.parent1_name" class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="bg-blue-50 p-2 rounded-lg text-blue-600">
                <UIcon name="i-heroicons-user" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">{{ student.parent1_name }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ student.parent1_rel }}</p>
              </div>
            </div>
            
            <div v-if="student.parent1_phone" class="flex items-center gap-3 pl-1">
              <UIcon name="i-heroicons-phone" class="w-4 h-4 text-gray-400" />
              <a :href="`tel:${student.parent1_phone}`" class="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                {{ student.parent1_phone }}
              </a>
            </div>
          </div>
          
          <div v-else class="text-sm text-gray-400 italic text-center py-2">No guardian info available.</div>

          <div v-if="student.allergies" class="mt-6 pt-4 border-t border-gray-100">
             <div class="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-3">
               <UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5 text-red-500 flex-shrink-0" />
               <div>
                 <p class="text-xs font-bold text-red-700 uppercase mb-0.5">Medical Alert</p>
                 <p class="text-xs text-red-600 leading-snug">{{ student.allergies }}</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div class="md:col-span-8 lg:col-span-8 space-y-6">
        
        <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 class="text-lg font-bold text-[#09033B] flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar-square" class="w-6 h-6 text-indigo-600" />
              Curriculum Progress
            </h3>
            <p class="text-sm text-gray-600 mt-1">Manage ACE PACEs (RR01 - 1072) and scores.</p>
          </div>
          <NuxtLink 
            :to="`/teacher/paces/${student.id}`" 
            class="w-full sm:w-auto bg-[#09033B] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
            Manage Paces
          </NuxtLink>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col">
          
          <div class="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg leading-tight">Academic History</h3>
                <p class="text-xs text-gray-500">Track performance across terms</p>
              </div>
            </div>
            <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
              {{ history.length }} Records Found
            </span>
          </div>

          <div class="flex-1">
            <div v-if="history.length === 0" class="h-full flex flex-col items-center justify-center p-12 text-gray-400">
              <div class="bg-gray-50 p-6 rounded-full mb-4">
                <UIcon name="i-heroicons-document-magnifying-glass" class="w-10 h-10 text-gray-300" />
              </div>
              <p class="text-sm font-medium">No academic records found.</p>
            </div>

            <ul v-else class="divide-y divide-gray-100">
              <li v-for="(rec, idx) in history" :key="idx" class="group hover:bg-gray-50 transition-colors duration-200">
                <div class="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  
                  <div class="flex items-center gap-4 flex-1">
                    <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-[#09033B]/5 text-[#09033B] rounded-xl flex flex-col items-center justify-center border border-[#09033B]/10">
                      <span class="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500">Session</span>
                      <span class="text-xs sm:text-sm font-black leading-none">{{ rec.session.split('/')[0] }}</span>
                      <span class="text-[8px] sm:text-[10px] font-bold text-gray-400 leading-none">/{{ rec.session.split('/')[1] }}</span>
                    </div>
                    
                    <div class="min-w-0"> 
                      <h4 class="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#09033B] transition-colors truncate">
                        {{ rec.term }} Report
                      </h4>
                      <div class="flex flex-wrap items-center gap-2 mt-1">
                         <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                           Class: {{ rec.class_level }}
                         </span>
                      </div>
                    </div>
                  </div>

                  <NuxtLink 
                    :to="`/report/${student.id}?session=${rec.session}&term=${rec.term}`" 
                    class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white border border-gray-200 hover:border-[#09033B] hover:text-[#09033B] text-gray-600 text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <UIcon name="i-heroicons-printer" class="w-4 h-4" />
                    <span>View Report</span>
                  </NuxtLink>

                </div>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'teacher'})

const route = useRoute()
const studentId = route.params.id

const { data, pending, error } = await useFetch('/api/teacher/student-details', {
  params: { id: studentId }
})

const student = computed(() => data.value?.student)
const history = computed(() => data.value?.history || [])
</script>