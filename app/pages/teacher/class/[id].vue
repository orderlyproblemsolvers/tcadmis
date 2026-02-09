<template>
  <div class="p-4 sm:p-8">
    <UNotifications /> 
    
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#09033B] mx-auto"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded text-red-600 text-center">
      {{ error.message }}
    </div>

    <div v-else>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Class Roster</span>
          <h1 class="text-3xl font-extrabold text-[#09033B] mt-1">{{ className }}</h1>
          <p class="text-sm text-gray-500 mt-1">Manage student results and reports for the current term.</p>
        </div>
        <div class="bg-blue-50 text-[#09033B] px-6 py-4 rounded-lg text-center min-w-[140px]">
          <span class="block text-3xl font-bold">{{ students.length }}</span>
          <span class="text-xs font-bold uppercase tracking-wide opacity-70">Students Enrolled</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Adm. No</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in students" :key="student.id" class="hover:bg-blue-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {{ student.admission_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <NuxtLink :to="`/teacher/students/${student.id}`" class="text-sm font-bold text-gray-900 hover:text-blue-700 hover:underline flex items-center gap-2">
                    {{ student.last_name }}, {{ student.first_name }}
                  </NuxtLink>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end items-center gap-3">
                    
                    <NuxtLink 
                      :to="`/teacher/results/${student.id}`" 
                      class="inline-flex items-center px-3 py-1.5 border border-[#09033B] rounded text-[#09033B] hover:bg-[#09033B] hover:text-white transition-colors text-xs font-bold"
                    >
                      <UIcon name="i-heroicons-pencil-square" class="w-4 h-4 mr-1.5" />
                      Input Scores
                    </NuxtLink>

                    <NuxtLink 
                      :to="`/report/${student.id}`" 
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 hover:text-black transition-colors text-xs font-bold"
                    >
                      <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1.5" />
                      View Report
                    </NuxtLink>
                    
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="students.length === 0" class="py-16 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
             <UIcon name="i-heroicons-users" class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">No Students Found</h3>
          <p class="mt-1 text-gray-500">There are no students currently registered in {{ className }}.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'teacher'})

const route = useRoute()
const className = route.params.id as string

const { data, pending, error } = await useFetch('/api/teacher/class-roster', {
  params: { class_name: className }
})

const students = computed(() => data.value?.students || [])
</script>