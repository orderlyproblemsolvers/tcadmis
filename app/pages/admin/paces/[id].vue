<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      
      <div class="mb-6">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <NuxtLink to="/admin/dashboard" class="hover:text-[#09033B]">Dashboard</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/admin/students/${studentId}`" class="hover:text-[#09033B]">Profile</NuxtLink>
          <span>/</span>
          <span class="font-bold text-gray-900">Pace History</span>
        </div>
        
        <div class="flex justify-between items-end">
          <div>
            <h1 class="text-3xl font-black text-[#09033B]">Academic Paces</h1>
            <p v-if="student" class="text-gray-500 mt-1">
              Viewing records for <span class="font-bold text-gray-900">{{ student.full_name }}</span>
            </p>
          </div>
          <div class="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs font-bold uppercase">
            Read Only View
          </div>
        </div>
      </div>

      <PaceTracker 
        :student-id="studentId" 
        mode="admin" 
      />

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const studentId = route.params.id as string

// Fetch basic student info using the admin endpoint
const { data } = await useFetch(`/api/admin/student-details`, {
  params: { id: studentId },
  transform: (res: any) => res.student
})
const student = data
</script>