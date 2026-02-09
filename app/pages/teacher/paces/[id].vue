<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      
      <div class="mb-6">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <NuxtLink to="/teacher/dashboard" class="hover:text-[#09033B]">Dashboard</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/teacher/students/${studentId}`" class="hover:text-[#09033B]">Student Profile</NuxtLink>
          <span>/</span>
          <span class="font-bold text-gray-900">Pace Tracker</span>
        </div>
        
        <div class="flex justify-between items-end">
          <div>
            <h1 class="text-3xl font-black text-[#09033B] flex items-center gap-3">
              <UIcon name="i-heroicons-chart-bar-square" class="w-8 h-8" />
              Curriculum Progress
            </h1>
            <p v-if="student" class="text-gray-500 mt-1">
              Recording progress for <span class="font-bold text-gray-900">{{ student.full_name }}</span>
            </p>
          </div>
          
          <div class="text-right hidden sm:block">
            <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Class</div>
            <div v-if="student" class="font-bold text-gray-900">{{ student.class_level }}</div>
          </div>
        </div>
      </div>

      <PaceTracker 
        :student-id="studentId" 
        mode="teacher" 
      />

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'teacher' })

const route = useRoute()
const studentId = route.params.id as string

// Fetch basic student info for the header
const { data } = await useFetch(`/api/teacher/student-details`, {
  params: { id: studentId },
  transform: (res: any) => res.student // We only need the name/class here
})
const student = data
</script>