<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto">
    
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <NuxtLink to="/teacher/dashboard" class="hover:text-[#09033B]">Dashboard</NuxtLink>
        <span>/</span>
        <NuxtLink v-if="student" :to="`/teacher/class/${student.class_level}`" class="hover:text-[#09033B]">
          {{ student.class_level }}
        </NuxtLink>
        <span v-else>...</span>
        <span>/</span>
        <span class="text-gray-900 font-medium">Student Profile</span>
      </div>
      <h1 class="text-3xl font-bold text-[#09033B]">Student Details</h1>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#09033B] mx-auto"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded text-red-600 text-center border border-red-200">
      <p class="font-bold">Access Denied</p>
      <p class="text-sm">{{ error.message }}</p>
      <NuxtLink to="/teacher/dashboard" class="text-sm underline mt-2 inline-block">Return to Dashboard</NuxtLink>
    </div>

    <div v-else-if="student" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-[#09033B] h-24 relative">
             <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
               <div class="w-24 h-24 bg-white rounded-full p-1 shadow-lg overflow-hidden">
                 <img v-if="student.photo_url" :src="student.photo_url" class="w-full h-full object-cover rounded-full" />
                 <div v-else class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-[#09033B]">
                   {{ student.first_name.charAt(0) }}{{ student.last_name.charAt(0) }}
                 </div>
               </div>
             </div>
          </div>
          
          <div class="pt-12 pb-6 px-6 text-center">
            <h2 class="text-xl font-bold text-gray-900">{{ student.last_name }}, {{ student.first_name }}</h2>
            <div class="flex justify-center gap-2 mt-2">
              <span class="text-gray-500 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded border">{{ student.admission_number }}</span>
              <span v-if="student.special_needs" class="text-white font-bold text-xs bg-purple-600 px-2 py-0.5 rounded flex items-center gap-1">
                <UIcon name="i-heroicons-sparkles" class="w-3 h-3" /> Special Needs
              </span>
            </div>

            <div class="mt-6 text-sm text-left space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
              <div class="flex justify-between border-b border-gray-200 pb-2">
                <span class="text-gray-500 text-xs uppercase font-bold">Class</span>
                <span class="font-medium text-[#09033B]">{{ student.class_level }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-200 pb-2">
                <span class="text-gray-500 text-xs uppercase font-bold">DOB</span>
                <span class="font-medium text-gray-900">{{ student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 text-xs uppercase font-bold">Gender</span>
                <span class="font-medium text-gray-900">{{ student.gender }}</span>
              </div>
            </div>

            <div class="mt-6 text-left">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Guardians</h4>
              <div v-if="student.parent1_name" class="bg-white border border-gray-200 p-2 rounded mb-2 text-sm">
                <p class="font-bold text-[#09033B]">{{ student.parent1_name }}</p>
                <div class="flex justify-between mt-1 text-xs">
                  <span class="text-gray-500">{{ student.parent1_rel }}</span>
                  <a :href="`tel:${student.parent1_phone}`" class="text-blue-600 hover:underline font-bold">{{ student.parent1_phone }}</a>
                </div>
              </div>
            </div>
            
            <div v-if="student.allergies" class="mt-4 text-left">
              <h4 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Medical / Allergies</h4>
              <div class="bg-red-50 text-red-800 text-xs p-2 rounded border border-red-100 font-medium">
                {{ student.allergies }}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="font-bold text-gray-800">Academic History</h3>
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ history.length }} Reports</span>
          </div>

          <div v-if="history.length === 0" class="p-12 text-center text-gray-400">
            <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No past records found.</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div v-for="(rec, idx) in history" :key="idx" class="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
              <div class="flex items-center gap-4">
                 <div class="bg-blue-50 text-blue-800 font-bold p-3 rounded-lg text-xs text-center min-w-[70px]">
                   {{ rec.session }}
                 </div>
                 <div>
                   <p class="font-bold text-gray-900 text-sm">{{ rec.term }}</p>
                   <p class="text-xs text-gray-500 mt-0.5">Class: {{ rec.class_level }}</p>
                 </div>
              </div>
              <NuxtLink 
                :to="`/report/${student.id}?session=${rec.session}&term=${rec.term}`" 
                target="_blank" 
                class="text-blue-600 hover:underline text-sm font-bold flex items-center gap-1"
              >
                <UIcon name="i-heroicons-eye" class="w-4 h-4" /> View
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'teacher', middleware: 'auth' })
const route = useRoute()
const studentId = route.params.id

const { data, pending, error } = await useFetch('/api/teacher/student-details', {
  params: { id: studentId }
})

const student = computed(() => data.value?.student)
const history = computed(() => data.value?.history || [])
</script>