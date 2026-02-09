<template>
  <div class="max-w-7xl mx-auto py-12 px-8">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-[#09033B]">Welcome, {{ user?.full_name }}</h1>
      <p class="text-gray-500 mt-2">Select a class to manage students and results.</p>
    </div>

    <div v-if="pending" class="text-center">Loading...</div>

    <div v-else-if="classes.length === 0" class="max-w-md mx-auto bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
      <h3 class="text-lg font-bold text-yellow-800">No Classes Assigned</h3>
      <p class="text-yellow-700 mt-2 text-sm">Please contact the administrator to assign you to a class.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink 
        v-for="cls in classes" 
        :key="cls.class_name"
        :to="`/teacher/class/${cls.class_name}`"
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-[#09033B] transition-all group"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#09033B] group-hover:bg-[#09033B] group-hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">{{ cls.student_count }} Students</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 group-hover:text-[#09033B]">{{ cls.class_name }}</h3>
        <p class="text-sm text-gray-500 mt-1">Manage roster & results &rarr;</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'teacher'})

defineOgImageComponent('TcadMis', {
  title: 'Teacher Portal',
  subtitle: 'Academic Excellence & Godly Education',
  label: 'Teacher'
})

const { user } = useUserSession()
const { data, pending } = await useFetch('/api/teacher/my-classes')
const classes = computed(() => data.value?.classes || [])
</script>