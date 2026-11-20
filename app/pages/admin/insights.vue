<template>
  <div class="space-y-8 font-sans p-6 max-w-7xl mx-auto min-h-screen relative">

    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-6 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black text-[#09033B] tracking-tight">School Insights</h1>
        <p class="text-gray-500 mt-1 font-medium">Real-time performance metrics and demographics.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <select v-model="selectedSession" @change="refreshData" class="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold bg-white focus:ring-2 focus:ring-[#09033B] hover:border-[#09033B] transition-colors cursor-pointer shadow-sm">
          <option value="2026/2027">2026/2027</option>
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
          <option v-for="cls in schoolClasses" :key="cls" :value="cls">{{ cls }}</option>
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
      <p class="text-gray-400 text-sm mt-3 font-medium animate-pulse">
        Crunching data for {{ selectedClass === 'All' ? 'the whole school' : selectedClass }}...
      </p>
    </div>

    <div v-else class="space-y-8">

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div class="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style="animation-delay:0ms">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#09033B] transition-colors">Total Students</p>
              <h3 class="text-4xl font-black text-[#09033B] mt-2 tracking-tight">{{ data?.stats?.total_students || 0 }}</h3>
            </div>
            <div class="h-11 w-11 rounded-2xl bg-blue-50 flex items-center justify-center text-[#09033B] group-hover:bg-[#09033B] group-hover:text-white transition-colors duration-300">
              <UIcon name="i-heroicons-users" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <div class="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style="animation-delay:80ms">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-purple-600 transition-colors">Active Staff</p>
              <h3 class="text-4xl font-black text-[#09033B] mt-2 tracking-tight">{{ data?.stats?.total_teachers || 0 }}</h3>
            </div>
            <div class="h-11 w-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <div class="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style="animation-delay:160ms">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-red-500 transition-colors">Failing Records</p>
              <h3 class="text-4xl font-black text-red-500 mt-2 tracking-tight">{{ data?.stats?.failing_records || 0 }}</h3>
              <p class="text-[10px] text-gray-400 mt-1 font-medium">Subject entries below 60%</p>
            </div>
            <div class="h-11 w-11 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <div class="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style="animation-delay:240ms">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest transition-colors" :class="termDeltaColor.label">Term Change</p>
              <h3 class="text-4xl font-black mt-2 tracking-tight" :class="termDeltaColor.value">{{ termDeltaDisplay }}</h3>
              <p class="text-[10px] text-gray-400 mt-1 font-medium">vs {{ data?.termOverTerm?.prev_term || 'Previous Term' }}</p>
            </div>
            <div class="h-11 w-11 rounded-2xl flex items-center justify-center transition-colors duration-300" :class="termDeltaColor.icon">
              <UIcon :name="termDeltaIcon" class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="schoolNarrative" class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-slide-up" style="animation-delay:300ms">
        <div class="bg-[#09033B] px-6 py-3 flex items-center gap-2">
          <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 text-yellow-300" />
          <span class="text-xs font-black text-white uppercase tracking-widest">School Story — {{ selectedTerm }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">
          <div class="p-5">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Context</p>
            <p class="text-sm text-gray-700 leading-relaxed font-medium">{{ schoolNarrative.setup }}</p>
          </div>
          <div class="p-5" :class="schoolNarrative.isPositive ? 'bg-amber-50/40' : 'bg-red-50/40'">
            <p class="text-[10px] font-black uppercase tracking-widest mb-2" :class="schoolNarrative.isPositive ? 'text-amber-500' : 'text-red-500'">Key Tension</p>
            <p class="text-sm leading-relaxed font-semibold" :class="schoolNarrative.isPositive ? 'text-amber-800' : 'text-red-800'">{{ schoolNarrative.conflict }}</p>
          </div>
          <div class="p-5 bg-green-50/40">
            <p class="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Recommended Action</p>
            <p class="text-sm text-green-900 leading-relaxed font-semibold">{{ schoolNarrative.resolution }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay:350ms">
          <h3 class="font-bold mb-1 text-[#09033B] flex items-center gap-2">
            <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><UIcon name="i-heroicons-chart-pie" class="w-4 h-4" /></div>
            Grade Distribution
          </h3>
          <p class="text-[11px] text-gray-400 font-medium mb-5 pl-1 italic">{{ gradeNarrativeTitle }}</p>
          <div class="relative min-h-[300px] flex items-center justify-center">
            <ClientOnly>
              <apexchart v-if="data?.gradeDistribution?.length" type="donut" width="100%" :options="gradeChartOptions" :series="gradeChartSeries" />
              <div v-else class="text-gray-400 text-sm italic py-12">No grades recorded.</div>
              <template #fallback><div class="animate-pulse"><div class="rounded-full bg-slate-200 h-44 w-44 mx-auto"></div></div></template>
            </ClientOnly>
          </div>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay:400ms">
          
          <div class="flex flex-col md:flex-row md:items-start justify-between mb-5 gap-4">
            <div>
              <h3 class="font-bold text-[#09033B] mb-1 flex items-center gap-2">
                <div class="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" /></div>
                Subject Performance
              </h3>
              <p class="text-[11px] text-gray-400 font-medium pl-1 italic">{{ subjectNarrativeTitle }}</p>
            </div>
            
            <div class="flex flex-col items-end gap-2">
              <div class="flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200/60 shadow-inner">
                <button @click="subjectChartType = 'treemap'" :class="subjectChartType === 'treemap' ? 'bg-white shadow-sm text-[#09033B]' : 'text-gray-500 hover:text-gray-700'" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all">Map</button>
                <button @click="subjectChartType = 'bar'" :class="subjectChartType === 'bar' ? 'bg-white shadow-sm text-[#09033B]' : 'text-gray-500 hover:text-gray-700'" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all">Rank</button>
                <button @click="subjectChartType = 'stacked'" :class="subjectChartType === 'stacked' ? 'bg-white shadow-sm text-[#09033B]' : 'text-gray-500 hover:text-gray-700'" class="px-3 py-1.5 rounded-lg text-xs font-black transition-all">Composition</button>
              </div>

              <div v-if="subjectChartType !== 'stacked'" class="flex gap-3 text-[9px] font-bold uppercase tracking-wider text-gray-500 px-2 py-1">
                <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-[#10b981]"></span> ≥ 75%</div>
                <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-[#f59e0b]"></span> ≥ 60%</div>
                <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-[#ef4444]"></span> Fail</div>
              </div>
            </div>
          </div>
          
          <div class="min-h-[300px]">
            <ClientOnly>
              
              <apexchart v-if="subjectChartType === 'treemap' && data?.subjectPerformance?.length" type="treemap" height="320" :options="subjectTreemapOptions" :series="subjectTreemapSeries" />
              
              <apexchart v-else-if="subjectChartType === 'bar' && data?.subjectPerformance?.length" type="bar" height="320" :options="subjectBarOptions" :series="subjectBarSeries" />
              
              <apexchart v-else-if="subjectChartType === 'stacked' && data?.subjectPerformance?.length" type="bar" height="320" :options="subjectStackedOptions" :series="subjectStackedSeries" />
              
              <div v-else-if="!data?.subjectPerformance?.length" class="text-gray-400 text-sm text-center py-12 italic">No subject data available.</div>
              <template #fallback><div class="animate-pulse w-full h-[320px] bg-slate-200 rounded-xl"></div></template>
            </ClientOnly>
          </div>
        </div>
      </div>

      <div v-if="selectedClass === 'All'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay:450ms">
          <h3 class="font-bold text-[#09033B] mb-1 flex items-center gap-2">
            <div class="p-1.5 bg-gray-100 rounded-lg"><UIcon name="i-heroicons-chart-bar" class="w-4 h-4" /></div>
            Class Performance
          </h3>
          <p class="text-[11px] text-gray-400 font-medium mb-5 pl-1 italic">{{ classNarrativeTitle }}</p>
          <div class="min-h-[280px]">
            <ClientOnly>
              <apexchart v-if="data?.classPerformance?.length" type="bar" height="300" :options="classChartOptions" :series="classChartSeries" />
              <div v-else class="text-gray-400 text-sm text-center py-12 italic">No academic data to display.</div>
            </ClientOnly>
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay:500ms">
          <h3 class="font-bold text-[#09033B] mb-6 flex items-center gap-2">
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
            <div v-if="getGenderCount('Male') + getGenderCount('Female') > 0">
              <div class="flex rounded-full overflow-hidden h-3">
                <div class="bg-blue-400 transition-all duration-700" :style="{ width: genderRatioPct + '%' }"></div>
                <div class="bg-pink-400 flex-1"></div>
              </div>
              <div class="flex justify-between text-[10px] font-bold text-gray-400 mt-1.5">
                <span>{{ genderRatioPct }}% Male</span>
                <span>{{ 100 - genderRatioPct }}% Female</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-green-100 animate-slide-up" style="animation-delay:550ms">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-green-700 flex items-center gap-2">
              <div class="p-1.5 bg-green-100 rounded-lg"><UIcon name="i-heroicons-trophy" class="w-5 h-5" /></div>
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
                <tr v-for="(s, index) in data?.bestPerformers" :key="index" @click="openModal(s)" class="group hover:bg-green-50/30 transition-colors duration-200 cursor-pointer">
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

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-red-100 animate-slide-up" style="animation-delay:620ms">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-red-700 flex items-center gap-2">
              <div class="p-1.5 bg-red-100 rounded-lg"><UIcon name="i-heroicons-bell-alert" class="w-5 h-5" /></div>
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
                <tr v-for="(s, index) in data?.atRisk" :key="index" @click="openModal(s)" class="group hover:bg-red-50/30 transition-colors duration-200 cursor-pointer">
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
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                {{ selectedStudent.first_name?.[0] || '' }}{{ selectedStudent.last_name?.[0] || '' }}
              </div>
              <div>
                <h2 class="text-xl font-black text-[#09033B]">{{ selectedStudent.last_name }} {{ selectedStudent.first_name }}</h2>
                <p class="text-sm font-bold text-gray-500">{{ selectedStudent.class_level }} &bull; {{ selectedTerm }}</p>
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
                <span class="text-xl font-black" :class="getScoreColorText(selectedStudent.term_average)">{{ selectedStudent.term_average }}%</span>
              </div>
              <div class="grid grid-cols-1 gap-3">
                <div v-for="record in studentRecords" :key="record.subject" class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors bg-white shadow-sm">
                  <span class="font-bold text-gray-700">{{ record.subject }}</span>
                  <span class="font-black w-12 text-right" :class="getScoreColorText(record.total_score)">{{ record.total_score }}%</span>
                </div>
              </div>
            </div>
            <div v-else class="py-12 text-center text-gray-400 italic">No detailed records found for this student in the selected term.</div>
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
              :class="['max-w-[85%] p-3.5 text-xs leading-relaxed rounded-2xl shadow-sm',
                msg.role === 'user' ? 'bg-[#09033B] text-white ml-auto rounded-br-none' : 'bg-white text-gray-700 mr-auto rounded-bl-none border border-gray-100']">
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
            <input v-model="userQuery" placeholder="e.g., Which subject has the worst pass rate?" class="flex-1 text-sm border border-gray-200 focus:ring-2 focus:ring-[#09033B]/20 focus:border-[#09033B] bg-gray-50 rounded-xl px-4 py-2.5 transition-all outline-none" />
            <button type="submit" :disabled="!userQuery || isThinking" class="bg-[#09033B] text-white p-2.5 rounded-xl hover:bg-[#09033B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95">
              <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 -rotate-45" />
            </button>
          </form>
        </div>
      </transition>
      <button @click="isChatOpen = !isChatOpen" class="h-14 w-14 rounded-full bg-[#09033B] text-white shadow-xl shadow-[#09033B]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group z-50">
        <UIcon v-if="!isChatOpen" name="i-heroicons-chat-bubble-left-right" class="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <UIcon v-else name="i-heroicons-chevron-down" class="w-7 h-7 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

definePageMeta({ layout: 'admin' })

// ─── STATE ────────────────────────────────────────────────
const selectedSession  = ref('2026/2027')
const selectedTerm     = ref('1st Term')
const selectedClass    = ref('All')
const subjectChartType = ref('treemap') // Default to treemap

const schoolClasses = [
  'Playgroup', 'Nursery 1', 'Nursery 2', 'Reading Readiness',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
]

// ─── DATA ─────────────────────────────────────────────────
const { data, pending, refresh } = await useFetch('/api/admin/insights', {
  query: computed(() => ({
    session:     selectedSession.value,
    term:        selectedTerm.value,
    class_level: selectedClass.value,
  })),
  watch: false,
})

const refreshData = async () => { await refresh() }

// ─── HELPERS ──────────────────────────────────────────────
const getGenderCount = (gender: string) => {
  const g = data.value?.gender?.find((i: any) => i.gender === gender)
  return g ? Number(g.count) : 0
}

const getScoreColorText = (score: number) => {
  if (score >= 75) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-500' 
  return 'text-red-600'
}

const genderRatioPct = computed(() => {
  const m = getGenderCount('Male'), f = getGenderCount('Female')
  return m + f > 0 ? Math.round((m / (m + f)) * 100) : 50
})

// ─── TERM DELTA STAT CARD ─────────────────────────────────
const termDeltaDisplay = computed(() => {
  const d = data.value?.termOverTerm?.delta
  if (d === null || d === undefined) return 'N/A'
  return (d >= 0 ? '+' : '') + d + '%'
})

const termDeltaColor = computed(() => {
  const d = data.value?.termOverTerm?.delta
  if (d === null || d === undefined) return { label: 'text-gray-400', value: 'text-gray-400', icon: 'bg-gray-100 text-gray-400' }
  if (d > 0) return { label: 'text-green-500', value: 'text-green-600', icon: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' }
  if (d < 0) return { label: 'text-red-500',   value: 'text-red-500',   icon: 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' }
  return { label: 'text-gray-400', value: 'text-gray-600', icon: 'bg-gray-100 text-gray-500' }
})

// ─── DATA STORYTELLING: NARRATIVE BANNER ──────────────────
const schoolNarrative = computed(() => {
  if (!data.value) return null
  const { stats, termOverTerm, subjectPerformance, atRisk } = data.value
  const delta       = termOverTerm?.delta
  const worstSub    = subjectPerformance?.[subjectPerformance.length - 1]
  const bestSub     = subjectPerformance?.[0]
  const atRiskCount = atRisk?.length ?? 0

  const setup = `${stats.total_students} student${stats.total_students !== 1 ? 's' : ''} enrolled ${
    selectedClass.value === 'All' ? 'across all classes' : `in ${selectedClass.value}`
  } for ${selectedTerm.value}, ${selectedSession.value}. ${stats.total_teachers} teaching staff on record.`

  let conflict = ''
  if (stats.failing_records === 0 && (delta === null || delta >= 0)) {
    conflict = `No subject entries fall below 60% this term.${delta > 0 ? ` The school average is up ${delta}% from last term — momentum is building.` : ''}`
  } else if (delta !== null && delta < 0) {
    conflict = `The school average dropped ${Math.abs(delta)}% from ${termOverTerm?.prev_term}, and ${stats.failing_records} subject entries remain below 60%.${worstSub ? ` ${worstSub.subject} has the lowest pass rate at ${worstSub.pass_rate}%.` : ''}`
  } else if (delta !== null && delta > 0) {
    conflict = `Average improved ${delta}% from last term, but ${stats.failing_records} subject entries still fall below 60%.${worstSub ? ` ${worstSub.subject} remains the weakest subject at ${worstSub.pass_rate}% pass rate.` : ''}`
  } else {
    conflict = `${stats.failing_records} subject entries fall below the 60% pass mark.${worstSub ? ` ${worstSub.subject} is the most at-risk subject — only ${worstSub.pass_rate}% of students passed.` : ''}`
  }

  let resolution = ''
  if (atRiskCount > 0 && worstSub) {
    resolution = `Act on the ${atRiskCount} at-risk student${atRiskCount > 1 ? 's' : ''} now, and schedule targeted ${worstSub.subject} intervention. If pass rate doesn't recover next term, review the teaching approach for that subject.`
  } else if (atRiskCount > 0) {
    resolution = `Reach out to the ${atRiskCount} at-risk student${atRiskCount > 1 ? 's' : ''} this week. A structured support plan now prevents compounding underperformance next term.`
  } else if (worstSub && worstSub.pass_rate < 70) {
    resolution = `No critical cases — focus on raising ${worstSub.subject}'s pass rate from ${worstSub.pass_rate}%.${bestSub ? ` Use ${bestSub.subject} (${bestSub.pass_rate}% passing) as the benchmark for what good looks like.` : ''}`
  } else {
    resolution = `Performance is stable. Use this term as the baseline for end-of-year comparisons and sustain current teaching standards.`
  }

  return { setup, conflict, resolution, isPositive: delta === null || delta >= 0 }
})

// ─── NARRATIVE CHART TITLES ────────────────────────────────
const gradeNarrativeTitle = computed(() => {
  const dist = data.value?.gradeDistribution
  if (!dist?.length) return ''
  const total  = dist.reduce((s: number, g: any) => s + Number(g.count), 0)
  const exc    = dist.find((g: any) => g.grade_band === 'EXC')
  const fail   = dist.find((g: any) => g.grade_band === 'FAIL')
  const excPct = exc ? Math.round((Number(exc.count) / total) * 100) : 0
  const failPct = fail ? Math.round((Number(fail.count) / total) * 100) : 0
  if (excPct > 30) return `Strong term — ${excPct}% of entries reached Excellent`
  if (failPct > 20) return `${failPct}% of entries are Failing (<60%)`
  return `Grade spread is mixed — monitor the passing thresholds`
})

const subjectNarrativeTitle = computed(() => {
  const subs = data.value?.subjectPerformance
  if (!subs?.length) return ''
  const worst    = subs[subs.length - 1]
  const highFail = subs.filter((s: any) => s.pass_rate < 60)
  if (highFail.length > 1) return `${highFail.length} subjects have fewer than 60% of students passing`
  if (worst?.pass_rate < 70) return `${worst.subject} is the weakest subject — ${worst.pass_rate}% pass rate`
  return `Pass rates are healthy across all subjects this term`
})

const classNarrativeTitle = computed(() => {
  const perf = data.value?.classPerformance
  if (!perf?.length) return ''
  const hasPrev   = perf.some((c: any) => c.prev_avg !== null)
  if (!hasPrev) return `Average scores by class — ${selectedTerm.value}`
  const improved  = perf.filter((c: any) => c.prev_avg !== null && c.current_avg > c.prev_avg).length
  const declined  = perf.filter((c: any) => c.prev_avg !== null && c.current_avg < c.prev_avg).length
  if (improved > declined) return `${improved} of ${perf.length} classes improved from last term`
  if (declined > improved) return `${declined} of ${perf.length} classes declined vs last term — current vs previous`
  return `Even split: half the classes improved, half declined vs last term`
})

// ─── APEXCHARTS BASE ──────────────────────────────────────
const chartBase = { fontFamily: 'inherit', toolbar: { show: false } }

// 1. Grade Donut
const gradeChartSeries  = computed(() => data.value?.gradeDistribution?.map((g: any) => Number(g.count)) || [])
const gradeChartOptions = computed(() => ({
  chart: { ...chartBase, type: 'donut' },
  labels: data.value?.gradeDistribution?.map((g: any) => g.grade_band) || [],
  colors: ['#09033B', '#3b82f6', '#cbd5e1', '#ef4444'],
  plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Entries', fontSize: '12px', fontWeight: 700 } } } } },
  dataLabels: { enabled: false },
  legend: { position: 'bottom', fontSize: '12px', fontWeight: 600 },
  stroke: { show: false },
}))

// 2A. Subject: TREEMAP
const subjectTreemapSeries = computed(() => [{
  data: data.value?.subjectPerformance?.map((s: any) => ({
    x: s.subject, 
    y: Number(s.total_entries),
    passRate: s.pass_rate,
    avgScore: s.avg_score,          
    highScore: s.highest_score,     
    lowScore: s.lowest_score,       
    fillColor: s.pass_rate >= 75 ? '#10b981' : s.pass_rate >= 60 ? '#f59e0b' : '#ef4444'
  })) || []
}])

const subjectTreemapOptions = computed(() => ({
  chart: { ...chartBase, type: 'treemap' },
  legend: { show: false }, 
  plotOptions: { treemap: { distributed: true, enableShades: false } },
  dataLabels: {
    enabled: true,
    style: { fontSize: '16px', fontWeight: 800, colors: ['#ffffff'] },
    dropShadow: { enabled: true, top: 1, left: 1, blur: 2, color: '#000000', opacity: 0.4 },
    formatter: (text: string, op: any) => {
      const rate = op.w.config.series[op.seriesIndex].data[op.dataPointIndex].passRate;
      return [text, `${rate}% Pass`];
    }
  },
  tooltip: {
    custom: function({ seriesIndex, dataPointIndex, w }: any) {
      const data = w.config.series[seriesIndex].data[dataPointIndex]
      return `
        <div class="bg-white p-3 shadow-xl rounded-xl border border-gray-100 min-w-[200px] font-sans">
          <div class="font-black text-[#09033B] border-b border-gray-100 pb-2 mb-2">${data.x}</div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Total Entries:</span> <span class="font-black text-gray-700">${data.y}</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Pass Rate:</span> <span class="font-black text-gray-700">${data.passRate}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Avg Score:</span> <span class="font-black text-blue-600">${data.avgScore}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Highest:</span> <span class="font-black text-green-600">${data.highScore}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Lowest:</span> <span class="font-black text-red-600">${data.lowScore}%</span></div>
          </div>
        </div>
      `
    }
  }
}))

// 2B. Subject: HORIZONTAL BAR (Ranking)
const subjectBarSeries = computed(() => [{
  name: 'Pass Rate',
  data: data.value?.subjectPerformance?.map((s: any) => Number(s.pass_rate)) || []
}])

const subjectBarOptions = computed(() => ({
  chart: { ...chartBase, type: 'bar' },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      dataLabels: { position: 'top' },
      colors: {
        ranges: [
          { from: 0, to: 59.9, color: '#ef4444' },
          { from: 60, to: 74.9, color: '#f59e0b' },
          { from: 75, to: 100, color: '#10b981' }
        ]
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val + '%',
    offsetX: 25,
    style: { fontSize: '11px', fontWeight: 700, colors: ['#374151'] }
  },
  xaxis: {
    max: 100,
    categories: data.value?.subjectPerformance?.map((s: any) => s.subject) || [],
    labels: { style: { fontSize: '11px', fontWeight: 600 } }
  },
  yaxis: { labels: { style: { fontSize: '12px', fontWeight: 700 } } },
  grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
  // ADDED: Same rich tooltip as Treemap, matching by index
  tooltip: {
    custom: function({ dataPointIndex }: any) {
      const sub = data.value?.subjectPerformance?.[dataPointIndex]
      if (!sub) return ''
      return `
        <div class="bg-white p-3 shadow-xl rounded-xl border border-gray-100 min-w-[200px] font-sans">
          <div class="font-black text-[#09033B] border-b border-gray-100 pb-2 mb-2">${sub.subject}</div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Total Entries:</span> <span class="font-black text-gray-700">${sub.total_entries}</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Pass Rate:</span> <span class="font-black text-gray-700">${sub.pass_rate}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Avg Score:</span> <span class="font-black text-blue-600">${sub.avg_score}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Highest:</span> <span class="font-black text-green-600">${sub.highest_score}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Lowest:</span> <span class="font-black text-red-600">${sub.lowest_score}%</span></div>
          </div>
        </div>
      `
    }
  }
}))

// 2C. Subject: STACKED BAR (Composition)
const subjectStackedSeries = computed(() => [
  { name: 'Passed', data: data.value?.subjectPerformance?.map((s: any) => Number(s.pass_count)) || [] },
  { name: 'Failed', data: data.value?.subjectPerformance?.map((s: any) => Number(s.fail_count)) || [] }
])

const subjectStackedOptions = computed(() => ({
  chart: { ...chartBase, type: 'bar', stacked: true },
  colors: ['#10b981', '#ef4444'], // Green for pass, Red for fail
  plotOptions: {
    bar: { horizontal: true, borderRadius: 3, dataLabels: { total: { enabled: true, style: { fontSize: '11px', fontWeight: 700 } } } }
  },
  dataLabels: { enabled: true, formatter: (val: number) => val > 0 ? val : '', style: { fontSize: '11px' } },
  xaxis: { categories: data.value?.subjectPerformance?.map((s: any) => s.subject) || [], labels: { show: false } },
  yaxis: { labels: { style: { fontSize: '12px', fontWeight: 700 } } },
  legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px', fontWeight: 600, markers: { radius: 4 } },
  grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: false } } },
  // ADDED: Rich tooltip tailored for Stacked Chart
  tooltip: {
    custom: function({ seriesIndex, dataPointIndex, w }: any) {
      const sub = data.value?.subjectPerformance?.[dataPointIndex]
      if (!sub) return ''
      
      const count = w.config.series[seriesIndex].data[dataPointIndex]
      const seriesName = w.config.series[seriesIndex].name
      const rate = seriesIndex === 0 ? sub.pass_rate : +(100 - sub.pass_rate).toFixed(1)
      
      return `
        <div class="bg-white p-3 shadow-xl rounded-xl border border-gray-100 min-w-[200px] font-sans">
          <div class="font-black text-[#09033B] border-b border-gray-100 pb-2 mb-2">${sub.subject}</div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs bg-gray-50 p-1.5 rounded-lg border border-gray-100"><span class="text-gray-700 font-bold">${seriesName}:</span> <span class="font-black text-[#09033B]">${count} (${rate}%)</span></div>
            <div class="flex justify-between text-xs mt-3"><span class="text-gray-500 font-bold">Total Entries:</span> <span class="font-black text-gray-700">${sub.total_entries}</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Avg Score:</span> <span class="font-black text-blue-600">${sub.avg_score}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Highest:</span> <span class="font-black text-green-600">${sub.highest_score}%</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-500 font-bold">Lowest:</span> <span class="font-black text-red-600">${sub.lowest_score}%</span></div>
          </div>
        </div>
      `
    }
  }
}))

// 3. Class Performance — grouped bar
const classChartSeries = computed(() => {
  const perf    = data.value?.classPerformance || []
  const hasPrev = perf.some((c: any) => c.prev_avg !== null)
  const series: any[] = [{ name: selectedTerm.value, data: perf.map((c: any) => Number(c.current_avg ?? 0)) }]
  if (hasPrev) series.push({ name: data.value?.termOverTerm?.prev_term || 'Previous', data: perf.map((c: any) => c.prev_avg !== null ? Number(c.prev_avg) : 0) })
  return series
})

const classChartOptions = computed(() => {
  const perf    = data.value?.classPerformance || []
  const hasPrev = perf.some((c: any) => c.prev_avg !== null)
  return {
    chart: { ...chartBase, type: 'bar' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: hasPrev ? '60%' : '45%', dataLabels: { position: 'top' } } },
    colors: ['#09033B', '#cbd5e1'],
    dataLabels: {
      enabled: true,
      offsetY: -18,
      style: { fontSize: '11px', colors: ['#09033B', '#94a3b8'] },
      formatter: (val: number) => val > 0 ? val + '%' : '',
    },
    xaxis: {
      categories: perf.map((c: any) => c.class_level),
      labels: { style: { fontSize: '11px', fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { max: 100, labels: { formatter: (val: number) => val + '%', style: { fontSize: '11px' } } },
    legend: { show: hasPrev, position: 'top', horizontalAlign: 'right', fontSize: '12px', fontWeight: 600, markers: { radius: 4 } },
    grid: { show: false },
    tooltip: { y: { formatter: (val: number) => val + '%' } },
  }
})

// ─── MODAL ────────────────────────────────────────────────
const selectedStudent = ref<any>(null)
const studentRecords  = ref<any[]>([])
const isModalLoading  = ref(false)

const openModal = async (student: any) => {
  selectedStudent.value = student
  isModalLoading.value  = true
  studentRecords.value  = []
  try {
    const res: any = await $fetch('/api/admin/student-term-results', {
      query: { student_id: student.student_id || student.id, session: selectedSession.value, term: selectedTerm.value },
    })
    studentRecords.value = res.records || []
  } catch (err) { console.error(err) }
  finally { isModalLoading.value = false }
}

const closeModal = () => { selectedStudent.value = null; studentRecords.value = [] }

// ─── CHAT ─────────────────────────────────────────────────
const isChatOpen    = ref(false)
const userQuery     = ref('')
const isThinking    = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const messages      = ref<{ role: string; text: string }[]>([
  { role: 'assistant', text: 'Hello! I have access to all student records, subject pass rates, and term-over-term trends. What would you like to explore?' },
])

const scrollToBottom = () => nextTick(() => chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' }))
const formatMessage  = (text: string) => text.replace(/\n/g, '<br>')

const askAI = async () => {
  if (!userQuery.value.trim()) return
  const question = userQuery.value
  messages.value.push({ role: 'user', text: question })
  userQuery.value  = ''
  isThinking.value = true
  scrollToBottom()
  try {
    const res: any = await $fetch('/api/admin/chat', {
      method: 'POST',
      body: { message: question, context: { session: selectedSession.value, term: selectedTerm.value, class_level: selectedClass.value } },
    })
    messages.value.push({ role: 'assistant', text: res.reply })
  } catch {
    messages.value.push({ role: 'assistant', text: 'I am having trouble connecting right now. Please try again.' })
  } finally {
    isThinking.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-slide-up { opacity: 0; animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in  { animation: fade-in-up 0.8s ease-out forwards; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to       { opacity: 0; transform: translateY(20px) scale(0.95); transform-origin: bottom right; }

.custom-scrollbar::-webkit-scrollbar       { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
