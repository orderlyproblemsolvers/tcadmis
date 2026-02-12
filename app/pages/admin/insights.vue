<template>
  <div class="space-y-8 font-sans p-6 max-w-7xl mx-auto min-h-screen relative">
    
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-6 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black text-[#09033B] tracking-tight">School Insights</h1>
        <p class="text-gray-500 mt-1 font-medium">Real-time performance metrics and demographics.</p>
      </div>
      <div class="flex gap-2">
        <select class="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold bg-white focus:ring-2 focus:ring-[#09033B] hover:border-[#09033B] transition-colors cursor-pointer shadow-sm">
          <option>2025/2026</option>
        </select>
        <select class="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold bg-white focus:ring-2 focus:ring-[#09033B] hover:border-[#09033B] transition-colors cursor-pointer shadow-sm">
          <option>1st Term</option>
        </select>
        <button @click="refreshData" class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#09033B] transition-colors">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" :class="{ 'animate-spin': pending }" />
        </button>
      </div>
    </div>

    <div v-if="pending" class="py-32 text-center">
      <div class="inline-flex items-center justify-center p-4 rounded-full bg-gray-50">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-[#09033B]" />
      </div>
      <p class="text-gray-400 text-sm mt-3 font-medium animate-pulse">Crunching the numbers...</p>
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
              <p class="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-red-500 transition-colors">Failing Grades</p>
              <h3 class="text-4xl font-black text-red-500 mt-2 tracking-tight">{{ data?.stats?.failing_records || 0 }}</h3>
              <p class="text-[10px] text-gray-400 mt-1 font-medium">Entries below 50%</p>
            </div>
            <div class="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-slide-up" style="animation-delay: 300ms;">
          <h3 class="font-bold text-[#09033B] mb-8 flex items-center gap-2">
            <div class="p-1.5 bg-gray-100 rounded-lg">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
            </div>
            Average Performance by Class
          </h3>
          
          <div class="space-y-5">
            <div v-for="(cls, index) in data?.classPerformance" :key="cls.class_level" class="space-y-2 group">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-gray-500 group-hover:text-[#09033B] transition-colors">{{ cls.class_level }}</span>
                <span class="text-[#09033B]">{{ cls.avg_score }}%</span>
              </div>
              <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-[1500ms] ease-out relative group-hover:opacity-90"
                  :class="getColorClass(cls.avg_score)"
                  :style="{ width: showAnimations ? `${cls.avg_score}%` : '0%' }"
                >
                  <div class="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#09033B] p-8 rounded-2xl shadow-xl text-white flex flex-col justify-center relative overflow-hidden group animate-slide-up" style="animation-delay: 400ms;">
           <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>
           <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>

           <h3 class="font-bold mb-8 flex items-center gap-2 relative z-10">
             <UIcon name="i-heroicons-chart-pie" class="w-5 h-5" />
             Gender Distribution
           </h3>
           
           <div class="space-y-4 relative z-10">
             <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5 flex items-center justify-between hover:bg-white/20 transition-all duration-300 cursor-default border border-white/5 hover:border-white/20">
               <div class="text-[10px] uppercase font-bold text-blue-200 tracking-widest">Boys</div>
               <div class="text-4xl font-black text-blue-300">{{ getGenderCount('Male') }}</div>
             </div>
             
             <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5 flex items-center justify-between hover:bg-white/20 transition-all duration-300 cursor-default border border-white/5 hover:border-white/20">
               <div class="text-[10px] uppercase font-bold text-pink-200 tracking-widest">Girls</div>
               <div class="text-4xl font-black text-pink-300">{{ getGenderCount('Female') }}</div>
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
                  <th class="px-4 py-3 text-left text-[10px] font-black text-green-800 uppercase tracking-wider">Class</th>
                  <th class="px-4 py-3 text-right text-[10px] font-black text-green-800 uppercase tracking-wider">Avg</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-white">
                <tr v-for="(s, index) in data?.bestPerformers" :key="s.student_id" class="group hover:bg-green-50/30 transition-colors duration-200">
                  <td class="px-4 py-3 text-sm font-bold text-gray-700 group-hover:text-green-900 flex items-center gap-2">
                    <span v-if="index === 0" class="text-yellow-400 text-lg drop-shadow-sm animate-pulse">★</span>
                    <span v-else class="text-gray-300 text-xs font-mono">{{ index + 1 }}.</span>
                    {{ s.last_name }} {{ s.first_name }}
                  </td>
                  <td class="px-4 py-3 text-xs text-gray-400 font-medium">{{ s.class_level }}</td>
                  <td class="px-4 py-3 text-sm font-black text-green-600 text-right">{{ s.term_average }}%</td>
                </tr>
                <tr v-if="!data?.bestPerformers.length">
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
                  <th class="px-4 py-3 text-left text-[10px] font-black text-red-800 uppercase tracking-wider">Class</th>
                  <th class="px-4 py-3 text-right text-[10px] font-black text-red-800 uppercase tracking-wider">Avg</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-white">
                <tr v-for="s in data?.atRisk" :key="s.student_id" class="group hover:bg-red-50/30 transition-colors duration-200">
                  <td class="px-4 py-3 text-sm font-medium text-gray-700 group-hover:text-red-900">{{ s.last_name }} {{ s.first_name }}</td>
                  <td class="px-4 py-3 text-xs text-gray-400 font-medium">{{ s.class_level }}</td>
                  <td class="px-4 py-3 text-sm font-bold text-red-500 text-right">{{ s.term_average }}%</td>
                </tr>
                <tr v-if="!data?.atRisk.length">
                  <td colspan="3" class="px-4 py-8 text-center text-sm text-gray-400 italic">No students currently flagged as at-risk.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

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
                <p class="text-[10px] text-blue-200 font-medium">Ask about students & performance</p>
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
          
          <span v-if="!isChatOpen" class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

definePageMeta({ layout: 'admin' })

const { data, pending, refresh } = await useFetch('/api/admin/insights')

// Animation State
const showAnimations = ref(false)

onMounted(() => {
  setTimeout(() => { showAnimations.value = true }, 100)
})

const refreshData = async () => {
  showAnimations.value = false
  await refresh()
  setTimeout(() => { showAnimations.value = true }, 100)
}

// --- CHAT LOGIC ---
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
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

// Basic formatter to handle newlines from AI
const formatMessage = (text: string) => {
  return text.replace(/\n/g, '<br>')
}

const askAI = async () => {
  if (!userQuery.value.trim()) return

  // 1. Add User Message
  const question = userQuery.value
  messages.value.push({ role: 'user', text: question })
  userQuery.value = ''
  isThinking.value = true
  scrollToBottom()

  try {
    // 2. Send to API (which fetches all results + uses Gemini)
    const res: any = await $fetch('/api/admin/chat', {
      method: 'POST',
      body: { message: question }
    })

    // 3. Add AI Response
    messages.value.push({ role: 'assistant', text: res.reply })
  } catch (err) {
    messages.value.push({ role: 'assistant', text: 'I apologize, but I am having trouble connecting to the data server right now. Please try again in a moment.' })
  } finally {
    isThinking.value = false
    scrollToBottom()
  }
}

// Helper for Progress Bar Color
const getColorClass = (score: number) => {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-[#09033B]'
  return 'bg-red-500'
}

// Helper for Gender Count
const getGenderCount = (gender: string) => {
  if (!data.value?.gender) return 0
  const g = data.value.gender.find((i: any) => i.gender === gender)
  return g ? g.count : 0
}
</script>

<style scoped>
/* 1. Entrance Animation (Fade Up) */
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

/* 2. Shimmer Effect */
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* 3. Chat Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transform-origin: bottom right;
}
</style>