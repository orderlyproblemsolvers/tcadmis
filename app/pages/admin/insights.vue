<template>
  <div class="space-y-8 font-sans p-6 max-w-7xl mx-auto min-h-screen relative">
    
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-6 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black text-[#09033B] tracking-tight">School Insights</h1>
        <p class="text-gray-500 mt-1 font-medium">Real-time performance metrics and demographics.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <select v-model="selectedSession" @change="refreshData" class="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold bg-white focus:ring-2 focus:ring-[#09033B] hover:border-[#09033B] transition-colors cursor-pointer shadow-sm">
          <option value="2025/2026">2025/2026</option>
          <option value="2024/2025">2024/2025</option>
        </select>
        
        <select v-model="selectedTerm" @change="refreshData" class="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold bg-white focus:ring-2 focus:ring-[#09033B] hover:border-[#09033B] transition-colors cursor-pointer shadow-sm">
          <option value="1st Term">1st Term</option>
          <option value="2nd Term">2nd Term</option>
          <option value="3rd Term">3rd Term</option>
        </select>
        
        <select v-model="selectedClass" @change="refreshData" class="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold bg-white focus:ring-2 focus:ring-[#09033B] hover:border-[#09033B] transition-colors cursor-pointer shadow-sm">
          <option value="All">All Classes</option>
          <option v-for="cls in schoolClasses" :key="cls" :value="cls">
            {{ cls }}
          </option>
        </select>
        
        <button @click="refreshData" class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#09033B] transition-colors shadow-sm">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" :class="{ 'animate-spin': pending }" />
        </button>
      </div>
    </div>

    <div v-if="pending" class="py-32 text-center">
      <div class="inline-flex items-center justify-center p-4 rounded-full bg-gray-50">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-[#09033B]" />
      </div>
      <p class="text-gray-400 text-sm mt-3 font-medium animate-pulse">Crunching data for {{ selectedClass === 'All' ? 'the whole school' : selectedClass }}...</p>
    </div>

    <div v-else class="space-y-8">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-up" style="animation-delay: 0ms;">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-[#09033B] transition-colors">Total Students</p>
              <h3 class="text-4xl font-black text-[#09033B] mt-2 tracking-tight">{{ data?.stats?.total_students || 0 }}</h3>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#09033B] group-hover:bg-[#09033B] group-hover:text-white transition-colors duration-300">
              <UIcon name="i-heroicons-users" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <div class="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-up" style="animation-delay: 100ms;">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-purple-600 transition-colors">Active Staff</p>
              <h3 class="text-4xl font-black text-[#09033B] mt-2 tracking-tight">{{ data?.stats?.total_teachers || 0 }}</h3>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <UIcon name="i-heroicons-academic-cap" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <div class="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-up" style="animation-delay: 200ms;">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-red-500 transition-colors">Failing Records</p>
              <h3 class="text-4xl font-black text-red-500 mt-2 tracking-tight">{{ data?.stats?.failing_records || 0 }}</h3>
              <p class="text-[10px] text-gray-400 mt-1 font-medium">Subject entries below 50%</p>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay: 250ms;">
           <h3 class="font-bold mb-6 flex items-center gap-2 text-[#09033B]">
             <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
               <UIcon name="i-heroicons-chart-pie" class="w-5 h-5" />
             </div>
             Grade Distribution
           </h3>
           <div class="relative min-h-[300px] flex items-center justify-center">
             <ClientOnly>
               <apexchart 
                 v-if="data?.gradeDistribution?.length"
                 type="donut" 
                 width="100%" 
                 :options="gradeChartOptions" 
                 :series="gradeChartSeries" 
               />
               <div v-else class="text-gray-400 text-sm italic py-12">No grades recorded.</div>
               <template #fallback>
                 <div class="animate-pulse flex space-x-4"><div class="rounded-full bg-slate-200 h-48 w-48 mx-auto"></div></div>
               </template>
             </ClientOnly>
           </div>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay: 300ms;">
          <h3 class="font-bold text-[#09033B] mb-6 flex items-center gap-2">
            <div class="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
            </div>
            Subject Performance Overview
          </h3>
          <div class="min-h-[300px]">
            <ClientOnly>
              <apexchart 
                v-if="data?.subjectPerformance?.length"
                type="bar" 
                height="320" 
                :options="subjectChartOptions" 
                :series="subjectChartSeries" 
              />
              <div v-else class="text-gray-400 text-sm text-center py-12 italic">No subject data available.</div>
              <template #fallback>
                 <div class="animate-pulse space-y-4 py-4"><div class="h-8 bg-slate-200 rounded w-3/4"></div><div class="h-8 bg-slate-200 rounded w-full"></div><div class="h-8 bg-slate-200 rounded w-5/6"></div></div>
              </template>
            </ClientOnly>
          </div>
        </div>

      </div>

      <div v-if="selectedClass === 'All'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay: 350ms;">
          <h3 class="font-bold text-[#09033B] mb-8 flex items-center gap-2">
            <div class="p-1.5 bg-gray-100 rounded-lg">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
            </div>
            Average Performance by Class
          </h3>
          
          <div class="min-h-[300px]">
            <ClientOnly>
              <apexchart 
                v-if="data?.classPerformance?.length"
                type="bar" 
                height="300" 
                :options="classChartOptions" 
                :series="classChartSeries" 
              />
              <div v-else class="text-gray-400 text-sm text-center py-12 italic">No academic data to display.</div>
            </ClientOnly>
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay: 400ms;">
           <h3 class="font-bold text-[#09033B] mb-8 flex items-center gap-2">
             <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
             Gender Distribution
           </h3>
           <div class="space-y-4">
             <div class="bg-white rounded-xl p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
               <div class="text-xs uppercase font-bold text-blue-500 tracking-widest">Boys</div>
               <div class="text-3xl font-black text-[#09033B]">{{ getGenderCount('Male') }}</div>
             </div>
             <div class="bg-white rounded-xl p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
               <div class="text-xs uppercase font-bold text-pink-500 tracking-widest">Girls</div>
               <div class="text-3xl font-black text-[#09033B]">{{ getGenderCount('Female') }}</div>
             </div>
           </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-green-100 animate-slide-up" style="animation-delay: 500ms;">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-green-700 flex items-center gap-2">
              <div class="p-1.5 bg-green-100 rounded-lg">
                <UIcon name="i-heroicons-trophy" class="w-5 h-5" />
              </div>
              Top Scholars
            </h3>
            <span class="text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-green-100">Highest Avg</span>
          </div>
          <div class="overflow-hidden rounded-xl border border-gray-100">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-green-50/50">
                <tr>
                  <th class="px-4 py-3 text-left text-[10px] font-black text-green-800 uppercase tracking-wider">Student</th>
                  <th v-if="selectedClass === 'All'" class="px-4 py-3 text-left text-[10px] font-black text-green-800 uppercase tracking-wider">Class</th>
                  <th class="px-4 py-3 text-right text-[10px] font-black text-green-800 uppercase tracking-wider">Avg</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-white">
                <tr v-for="(s, index) in data?.bestPerformers" :key="index" 
                    @click="openModal(s)"
                    class="group hover:bg-green-50/30 transition-colors duration-200 cursor-pointer">
                  <td class="px-4 py-3 text-sm font-bold text-gray-700 group-hover:text-green-900 flex items-center gap-2">
                    <span v-if="index === 0" class="text-yellow-400 text-lg drop-shadow-sm animate-pulse">★</span>
                    <span v-else class="text-gray-300 text-xs font-mono">{{ index + 1 }}.</span>
                    {{ s.last_name }} {{ s.first_name }}
                  </td>
                  <td v-if="selectedClass === 'All'" class="px-4 py-3 text-xs text-gray-400 font-medium">{{ s.class_level }}</td>
                  <td class="px-4 py-3 text-sm font-black text-green-600 text-right">{{ s.term_average }}%</td>
                </tr>
                <tr v-if="!data?.bestPerformers?.length">
                  <td colspan="3" class="px-4 py-8 text-center text-sm text-gray-400 italic">No data available yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-red-100 animate-slide-up" style="animation-delay: 600ms;">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-red-700 flex items-center gap-2">
              <div class="p-1.5 bg-red-100 rounded-lg">
                <UIcon name="i-heroicons-bell-alert" class="w-5 h-5" />
              </div>
              Needs Attention
            </h3>
            <span class="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-red-100">Lowest Avg</span>
          </div>
          <div class="overflow-hidden rounded-xl border border-gray-100">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-red-50/50">
                <tr>
                  <th class="px-4 py-3 text-left text-[10px] font-black text-red-800 uppercase tracking-wider">Student</th>
                  <th v-if="selectedClass === 'All'" class="px-4 py-3 text-left text-[10px] font-black text-red-800 uppercase tracking-wider">Class</th>
                  <th class="px-4 py-3 text-right text-[10px] font-black text-red-800 uppercase tracking-wider">Avg</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-white">
                <tr v-for="(s, index) in data?.atRisk" :key="index" 
                    @click="openModal(s)"
                    class="group hover:bg-red-50/30 transition-colors duration-200 cursor-pointer">
                  <td class="px-4 py-3 text-sm font-medium text-gray-700 group-hover:text-red-900">{{ s.last_name }} {{ s.first_name }}</td>
                  <td v-if="selectedClass === 'All'" class="px-4 py-3 text-xs text-gray-400 font-medium">{{ s.class_level }}</td>
                  <td class="px-4 py-3 text-sm font-bold text-red-500 text-right">{{ s.term_average }}%</td>
                </tr>
                <tr v-if="!data?.atRisk?.length">
                  <td colspan="3" class="px-4 py-8 text-center text-sm text-gray-400 italic">No students currently flagged as at-risk.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="selectedStudent" class="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
        <div class="absolute inset-0 bg-[#09033B]/40 backdrop-blur-sm" @click="closeModal"></div>
        
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
          <div class="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                  {{ selectedStudent.first_name?.[0] || '' }}{{ selectedStudent.last_name?.[0] || '' }}
                </div>
                <div>
                  <h2 class="text-xl font-black text-[#09033B]">{{ selectedStudent.last_name }} {{ selectedStudent.first_name }}</h2>
                  <p class="text-sm font-bold text-gray-500">{{ selectedStudent.class_level }} &bull; {{ selectedTerm }}</p>
                </div>
              </div>
            </div>
            <button @click="closeModal" class="p-2 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors">
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div v-if="isModalLoading" class="py-12 flex flex-col items-center justify-center">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500 mb-4" />
              <p class="text-sm text-gray-400 font-medium">Fetching subject records...</p>
            </div>
            
            <div v-else-if="studentRecords.length > 0" class="space-y-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-gray-700">Term Average</h3>
                <span class="text-xl font-black" :class="getScoreColorText(selectedStudent.term_average)">
                  {{ selectedStudent.term_average }}%
                </span>
              </div>
              
              <div class="grid grid-cols-1 gap-3">
                <div v-for="record in studentRecords" :key="record.subject" 
                     class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors bg-white shadow-sm">
                  <span class="font-bold text-gray-700">{{ record.subject }}</span>
                  <div class="flex items-center gap-4">
                    <span class="font-black w-12 text-right" :class="getScoreColorText(record.total_score)">
                      {{ record.total_score }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="py-12 text-center text-gray-400 italic">
              No detailed records found for this student in the selected term.
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 print:hidden">
      <transition name="slide-up">
        <div v-if="isChatOpen" class="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] animate-fade-in">
          <div class="bg-[#09033B] p-4 flex justify-between items-center text-white shadow-md z-10">
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <div class="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h3 class="font-bold text-sm">Insights AI</h3>
                <p class="text-[10px] text-blue-200 font-medium">Ask about {{ selectedClass === 'All' ? 'students' : selectedClass }}</p>
              </div>
            </div>
            <button @click="isChatOpen = false" class="hover:bg-white/10 rounded-lg p-1.5 transition-colors">
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 scroll-smooth" ref="chatContainer">
            <div v-for="(msg, i) in messages" :key="i" 
              :class="['max-w-[85%] p-3.5 text-xs leading-relaxed rounded-2xl shadow-sm transition-all duration-300', 
                msg.role === 'user' 
                  ? 'bg-[#09033B] text-white ml-auto rounded-br-none' 
                  : 'bg-white text-gray-700 mr-auto rounded-bl-none border border-gray-100']">
              <div v-if="msg.role === 'assistant'" class="markdown-body" v-html="formatMessage(msg.text)"></div>
              <span v-else>{{ msg.text }}</span>
            </div>
            
            <div v-if="isThinking" class="flex gap-1.5 p-3 bg-white rounded-2xl rounded-bl-none w-16 border border-gray-100 shadow-sm">
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>

          <form @submit.prevent="askAI" class="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              v-model="userQuery" 
              placeholder="e.g., Who is the best student?" 
              class="flex-1 text-sm border border-gray-200 focus:ring-2 focus:ring-[#09033B]/20 focus:border-[#09033B] bg-gray-50 rounded-xl px-4 py-2.5 transition-all outline-none"
            />
            <button type="submit" :disabled="!userQuery || isThinking" class="bg-[#09033B] text-white p-2.5 rounded-xl hover:bg-[#09033B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95">
              <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 -rotate-45" />
            </button>
          </form>
        </div>
      </transition>

      <button 
        @click="isChatOpen = !isChatOpen"
        class="h-14 w-14 rounded-full bg-[#09033B] text-white shadow-xl shadow-[#09033B]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group z-50"
      >
        <div class="relative">
          <UIcon v-if="!isChatOpen" name="i-heroicons-chat-bubble-left-right" class="w-7 h-7 group-hover:rotate-12 transition-transform" />
          <UIcon v-else name="i-heroicons-chevron-down" class="w-7 h-7 group-hover:-translate-y-1 transition-transform" />
        </div>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

definePageMeta({ layout: 'admin' })

// 1. STATE & FILTERS
const selectedSession = ref('2025/2026')
const selectedTerm = ref('1st Term') 
const selectedClass = ref('All')

const schoolClasses = [
  'Playgroup', 'Nursery 1', 'Nursery 2', 'Reading Readiness',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'
]

// 2. DATA FETCHING
const { data, pending, refresh } = await useFetch('/api/admin/insights', {
  query: computed(() => ({
    session: selectedSession.value,
    term: selectedTerm.value,
    class_level: selectedClass.value,
    refresh: 'true' // Forces a bypass of cache on manual refresh
  })),
  watch: false
})

const refreshData = async () => {
  await refresh()
}

const getGenderCount = (gender: string) => {
  if (!data.value?.gender) return 0
  const g = data.value.gender.find((i: any) => i.gender === gender)
  return g ? Number(g.count) : 0
}

const getScoreColorText = (score: number) => {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

// ==========================================
// APEXCHARTS COMPUTED CONFIGURATIONS
// ==========================================

// 1. GRADE DISTRIBUTION (DONUT)
const gradeChartSeries = computed(() => {
  return data.value?.gradeDistribution?.map((g: any) => Number(g.count)) || []
})

const gradeChartOptions = computed(() => {
  return {
    chart: { type: 'donut', fontFamily: 'inherit' },
    labels: data.value?.gradeDistribution?.map((g: any) => g.grade_band) || [],
    colors: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#64748b', '#ef4444'], // Custom palette
    plotOptions: {
      pie: {
        donut: { size: '70%', labels: { show: true, total: { show: true, label: 'Total Grades' } } }
      }
    },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' },
    stroke: { show: false }
  }
})

// 2. SUBJECT PERFORMANCE (HORIZONTAL BAR)
const subjectChartSeries = computed(() => {
  return [{
    name: 'Class Average',
    data: data.value?.subjectPerformance?.map((s: any) => Number(s.avg_score)) || []
  }]
})

const subjectChartOptions = computed(() => {
  return {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, dataLabels: { position: 'top' } }
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: true,
      offsetX: 20,
      style: { fontSize: '12px', colors: ['#64748b'] },
      formatter: (val: number) => val + '%'
    },
    xaxis: {
      categories: data.value?.subjectPerformance?.map((s: any) => s.subject) || [],
      max: 100,
      labels: { formatter: (val: number) => val + '%' }
    },
    grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } }
  }
})

// 3. CLASS PERFORMANCE (COLUMN BAR)
const classChartSeries = computed(() => {
  return [{
    name: 'Average Score',
    data: data.value?.classPerformance?.map((c: any) => Number(c.avg_score)) || []
  }]
})

const classChartOptions = computed(() => {
  return {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '50%', dataLabels: { position: 'top' } }
    },
    colors: ['#09033B'],
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '12px', colors: ['#09033B'] },
      formatter: (val: number) => val + '%'
    },
    xaxis: {
      categories: data.value?.classPerformance?.map((c: any) => c.class_level) || [],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      max: 100,
      labels: { formatter: (val: number) => val + '%' }
    },
    grid: { show: false }
  }
})

// ==========================================
// MODAL & CHAT LOGIC
// ==========================================

const selectedStudent = ref<any>(null)
const studentRecords = ref<any>([])
const isModalLoading = ref(false)

const openModal = async (student: any) => {
  selectedStudent.value = student
  isModalLoading.value = true
  studentRecords.value = []
  try {
    const res: any = await $fetch('/api/admin/student-term-results', {
      query: {
        student_id: student.student_id || student.id,
        session: selectedSession.value,
        term: selectedTerm.value
      }
    })
    studentRecords.value = res.records || []
  } catch (err) {
    console.error('Failed to load student records', err)
  } finally {
    isModalLoading.value = false
  }
}

const closeModal = () => {
  selectedStudent.value = null
  studentRecords.value = []
}

const isChatOpen = ref(false)
const userQuery = ref('')
const isThinking = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const messages = ref<{role: string, text: string}[]>([
  { role: 'assistant', text: 'Hello! I am your AI assistant. I have access to all student records and performance data. How can I help you analyze the school today?' }
])

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })
    }
  })
}

const formatMessage = (text: string) => text.replace(/\n/g, '<br>')

const askAI = async () => {
  if (!userQuery.value.trim()) return
  const question = userQuery.value
  messages.value.push({ role: 'user', text: question })
  userQuery.value = ''
  isThinking.value = true
  scrollToBottom()

  try {
    const res: any = await $fetch('/api/admin/chat', {
      method: 'POST',
      body: { 
        message: question,
        context: { session: selectedSession.value, term: selectedTerm.value, class_level: selectedClass.value }
      }
    })
    messages.value.push({ role: 'assistant', text: res.reply })
  } catch (err) {
    messages.value.push({ role: 'assistant', text: 'I apologize, but I am having trouble connecting right now.' })
  } finally {
    isThinking.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  opacity: 0; 
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fade-in-up 0.8s ease-out forwards;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); transform-origin: bottom right; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>