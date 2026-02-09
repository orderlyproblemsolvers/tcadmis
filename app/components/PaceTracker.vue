<template>
  <div class="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
    
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-5 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-5 opacity-0"
    >
      <div v-if="toastMessage" class="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2"
        :class="toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-[#09033B] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clip-rule="evenodd" />
          </svg>
          PACE Progress
        </h3>
        
        <div class="hidden md:flex gap-3 text-[10px] ml-4 border-l pl-4 border-gray-300">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span> Mastered (90%+)</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-200"></span> Passed (80%+)</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full border border-gray-300"></span> Pending</span>
        </div>
      </div>
      
      <div class="flex overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto gap-2 no-scrollbar">
        <button 
          v-for="sub in subjects" 
          :key="sub"
          @click="activeSubject = sub"
          class="px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-all border"
          :class="activeSubject === sub 
            ? 'bg-[#09033B] text-white border-[#09033B] shadow-sm' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
        >
          {{ sub }}
        </button>
      </div>
    </div>

    <div class="p-6 bg-white min-h-[400px]">
      
      <div v-if="pending" class="mb-4 text-xs text-blue-600 flex items-center gap-2 animate-pulse justify-center font-bold">
        <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Syncing records...
      </div>

      <div class="space-y-6">
        <div v-for="level in curriculumLevels" :key="level.id" class="border border-gray-200 rounded-lg overflow-hidden">
          
          <button 
            @click="toggleLevel(level.id)"
            class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
          >
            <div class="flex items-center gap-3">
              <span class="font-bold text-sm text-gray-800">{{ level.label }}</span>
              <span class="text-[10px] text-gray-500 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
                {{ level.range }}
              </span>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500 transition-all duration-500" :style="{ width: `${getLevelProgress(level)}%` }"></div>
                </div>
                <span class="text-xs font-bold text-gray-600">{{ getLevelProgress(level) }}%</span>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="openLevels.includes(level.id) ? 'rotate-180' : ''"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>

          <div v-show="openLevels.includes(level.id)" class="p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3 bg-white transition-all">
            <button 
              v-for="pace in level.paces" 
              :key="pace"
              @click="handlePaceClick(pace)"
              :disabled="loadingPace === pace"
              class="relative aspect-square rounded border-2 flex flex-col items-center justify-center transition-all group hover:shadow-md hover:-translate-y-0.5"
              :class="getPaceStyle(pace)"
            >
              <span class="text-[10px] font-bold opacity-70 mb-0.5">{{ pace }}</span>
              
              <span v-if="getRecord(pace)?.score" class="text-xs font-black bg-white/90 px-1 rounded shadow-sm">
                {{ getRecord(pace).score }}%
              </span>
              <span v-else class="text-lg text-gray-300 font-thin">+</span>

              <div v-if="getRecord(pace)?.is_completed" class="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow-sm border border-green-100 p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-green-600">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5Z" clip-rule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
      
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 class="font-bold text-[#09033B] text-lg">Update PACE</h3>
            <p class="text-xs text-gray-500">{{ activeSubject }} - {{ selectedPace }}</p>
          </div>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          
          <div 
            @click="editForm.is_completed = !editForm.is_completed"
            class="flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200"
            :class="editForm.is_completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'"
          >
            <div>
              <span class="block font-bold text-sm" :class="editForm.is_completed ? 'text-green-800' : 'text-gray-700'">
                {{ editForm.is_completed ? 'Completed' : 'In Progress' }}
              </span>
              <span class="text-xs text-gray-500">Is this PACE finished?</span>
            </div>
            
            <div class="w-12 h-6 rounded-full p-1 transition-colors duration-300" :class="editForm.is_completed ? 'bg-green-500' : 'bg-gray-300'">
              <div class="bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300" :class="editForm.is_completed ? 'translate-x-6' : 'translate-x-0'"></div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Score Obtained</label>
            <div class="relative">
              <input 
                v-model.number="editForm.score" 
                type="number" 
                min="0" 
                max="100" 
                class="block w-full rounded-lg border-gray-300 bg-gray-50 border p-3 pl-4 pr-12 text-gray-900 focus:border-[#09033B] focus:ring-[#09033B] focus:bg-white transition-all font-bold text-lg"
                placeholder="0"
              />
              <span class="absolute right-4 top-3.5 text-gray-400 font-bold">%</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <button 
              @click="isModalOpen = false"
              class="py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="saveRecord"
              :disabled="isSaving"
              class="py-3 text-sm font-bold text-white bg-[#09033B] hover:opacity-90 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-md"
            >
              <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  studentId: string
  mode: 'admin' | 'teacher'
}>()

// Constants
const subjects = [
  'Math', 'English', 'Social Studies', 'Science', 
  'Word Building', 'Creative Writing', 'Reading Readiness'
]

// State
const activeSubject = ref('Math')
const openLevels = ref(['grade_1']) 
const records = ref<Record<string, any>>({}) 
const loadingPace = ref('')
const isModalOpen = ref(false)
const selectedPace = ref('')
const isSaving = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const editForm = ref({
  score: 0,
  is_completed: false
})

// --- 1. DATA FETCHING (Lazy Load) ---
const apiPath = computed(() => 
  props.mode === 'admin' ? '/api/admin/paces' : '/api/teacher/paces'
)

const { data, pending } = useFetch(apiPath, {
  params: { student_id: props.studentId },
  lazy: true, 
  server: false 
})

watch(data, (newVal) => {
  const map: Record<string, any> = {}
  if (Array.isArray(newVal)) {
    newVal.forEach((rec: any) => {
      map[`${rec.subject}_${rec.pace_number}`] = rec
    })
  }
  records.value = map
}, { immediate: true })

// --- 2. GRID GENERATOR ---
const curriculumLevels = computed(() => {
  const levels = []
  
  // Reading Readiness
  if (['Reading Readiness', 'English'].includes(activeSubject.value)) {
    levels.push({
      id: 'rr',
      label: 'Kindergarten (RR)',
      range: 'RR01 - RR12',
      paces: Array.from({ length: 12 }, (_, i) => `RR${String(i + 1).padStart(2, '0')}`)
    })
  }

  // Grades 1-6 Only
  const startPace = 1001
  for (let i = 0; i < 6; i++) {
    const start = startPace + (i * 12)
    const end = start + 11
    const paceNumbers = Array.from({ length: 12 }, (_, j) => String(start + j))
    
    levels.push({
      id: `grade_${i + 1}`,
      label: `Grade ${i + 1}`,
      range: `${start} - ${end}`,
      paces: paceNumbers
    })
  }
  return levels
})

// --- 3. UI HELPERS ---
const toggleLevel = (id: string) => {
  if (openLevels.value.includes(id)) {
    openLevels.value = openLevels.value.filter(x => x !== id)
  } else {
    openLevels.value.push(id)
  }
}

const getRecord = (pace: string) => records.value[`${activeSubject.value}_${pace}`]

const getPaceStyle = (pace: string) => {
  const rec = getRecord(pace)
  let classes = ''
  
  if (props.mode === 'teacher') classes += 'cursor-pointer '
  else classes += 'cursor-default opacity-90 '

  // Empty State
  if (!rec) return classes + 'bg-white border-gray-200 text-gray-300 hover:border-blue-300 hover:text-blue-300'
  
  // Completed Logic
  if (rec.is_completed) {
    if (rec.score >= 90) return classes + 'bg-green-100 border-green-500 text-green-900 font-bold shadow-sm' 
    if (rec.score >= 80) return classes + 'bg-green-50 border-green-300 text-green-800 shadow-sm' 
    return classes + 'bg-amber-50 border-amber-300 text-amber-800' // Failed/Retake
  }
  
  // Started but not completed
  return classes + 'bg-white border-blue-400 text-blue-900 shadow-inner'
}

const getLevelProgress = (level: any) => {
  const total = level.paces.length
  const completed = level.paces.filter((p: string) => {
    const rec = records.value[`${activeSubject.value}_${p}`]
    return rec?.is_completed
  }).length
  return Math.round((completed / total) * 100)
}

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => toastMessage.value = '', 3000)
}

// --- 4. ACTIONS ---
const handlePaceClick = (pace: string) => {
  if (props.mode !== 'teacher') return
  
  selectedPace.value = pace
  const rec = getRecord(pace)
  
  editForm.value = {
    score: rec?.score || null,
    is_completed: rec?.is_completed || false
  }
  
  isModalOpen.value = true
}

const saveRecord = async () => {
  isSaving.value = true
  
  try {
    const payload = {
      student_id: props.studentId,
      subject: activeSubject.value,
      pace_number: selectedPace.value,
      score: editForm.value.score,
      is_completed: editForm.value.is_completed
    }

    await $fetch('/api/teacher/paces', {
      method: 'POST',
      body: payload
    })

    // Optimistic Update
    const key = `${activeSubject.value}_${selectedPace.value}`
    records.value[key] = { ...payload }
    
    isModalOpen.value = false
    showToast('Record saved successfully', 'success')

  } catch (err) {
    showToast('Failed to save record', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>