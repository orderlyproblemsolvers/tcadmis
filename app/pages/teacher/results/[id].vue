<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6 pb-24 font-sans">
    <div class="max-w-[95%] mx-auto">
      
      <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
        <div>
          <button @click="confirmExit('/teacher/dashboard')" class="text-sm text-gray-500 hover:text-[#09033B] transition-colors font-medium flex items-center gap-1">
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" /> Back to Dashboard
          </button>
          <div class="mt-2">
            <h1 class="text-2xl font-black text-[#09033B] tracking-tight">Result Entry</h1>
            <p v-if="student" class="text-gray-600 flex items-center gap-2 mt-1">
              Student: <span class="font-bold text-black">{{ student.student.first_name }} {{ student.student.last_name }}</span> 
              <span class="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">{{ student.student.admission_number }}</span>
            </p>
            <p v-else class="text-gray-400 text-sm animate-pulse">Loading student details...</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
           <div class="flex flex-col">
             <label class="text-[10px] font-bold text-gray-400 uppercase mb-1">Session</label>
             <select v-model="formData.session" class="border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-[#09033B] outline-none">
               <option>2025/2026</option>
               <option>2026/2027</option>
             </select>
           </div>
           <div class="flex flex-col">
             <label class="text-[10px] font-bold text-gray-400 uppercase mb-1">Term</label>
             <select v-model="formData.term" class="border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-[#09033B] outline-none">
               <option>1st Term</option>
               <option>2nd Term</option>
               <option>3rd Term</option>
             </select>
           </div>
        </div>
      </div>

      <div class="flex border-b border-gray-200 mb-6 gap-6">
        <button 
          @click="activeTab = 'academic'" 
          :class="['pb-3 text-sm font-bold transition-all relative', activeTab === 'academic' ? 'text-[#09033B]' : 'text-gray-400 hover:text-gray-600']"
        >
          1. Academic Scores
          <div v-if="activeTab === 'academic'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#09033B]"></div>
        </button>
        <button 
          @click="activeTab = 'remarks'" 
          :class="['pb-3 text-sm font-bold transition-all relative', activeTab === 'remarks' ? 'text-[#09033B]' : 'text-gray-400 hover:text-gray-600']"
        >
          2. Report Data & Remarks
          <div v-if="activeTab === 'remarks'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#09033B]"></div>
        </button>
      </div>

      <div v-if="loadingData" class="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#09033B] mb-3"></div>
        <p class="text-gray-400 font-medium">Fetching records...</p>
      </div>

      <div v-else>
        
        <div v-show="activeTab === 'academic'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          
          <div class="bg-blue-50 text-blue-700 px-4 py-2 text-xs font-medium flex items-center justify-between">
             <span class="flex items-center gap-2">
               <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
               Tip: Use <b>Arrow Keys</b> to navigate. Press <b>Enter</b> to move down.
             </span>
             <span v-if="isDirty" class="text-amber-600 font-bold flex items-center gap-1 animate-pulse">
               <UIcon name="i-heroicons-pencil" class="w-3 h-3" /> Unsaved Changes
             </span>
          </div>

          <div class="overflow-auto max-h-[70vh] relative custom-scrollbar">
            <table class="min-w-full border-collapse">
              <thead class="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th class="sticky left-0 z-30 bg-gray-50 px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider w-64 border-b border-r border-gray-200 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                    Subject
                  </th>
                  <th v-for="(h, i) in headers" :key="i" class="px-2 py-3 text-center text-[10px] font-bold text-gray-500 uppercase w-20 border-b border-gray-100">
                    {{ h.label }}<br><span class="text-gray-300">({{ h.max }})</span>
                  </th>
                  <th class="px-2 py-3 text-center text-[10px] font-black text-blue-800 uppercase bg-blue-50/50 w-24 border-b border-blue-100">
                    Exam<br><span class="text-blue-400">(60)</span>
                  </th>
                  <th class="px-4 py-3 text-center text-[10px] font-black text-gray-800 uppercase w-24 border-b border-gray-200">
                    Total<br><span class="text-gray-400">(100)</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr 
                  v-for="(row, rIndex) in formData.academics" 
                  :key="row.subject" 
                  :class="{'bg-yellow-50': focusedRow === rIndex, 'hover:bg-gray-50 transition-colors': focusedRow !== rIndex}"
                >
                  <td class="sticky left-0 z-10 px-4 py-2 text-xs font-bold text-gray-700 border-r border-gray-200 bg-inherit shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    {{ row.subject }}
                  </td>

                  <td v-for="(field, cIndex) in fieldKeys" :key="field" :class="field === 'exam' ? 'bg-blue-50/30' : ''" class="p-1">
                    <input 
                      :id="`cell-${rIndex}-${cIndex}`"
                      v-model="row[field]" 
                      type="number" 
                      min="0" 
                      :max="field === 'exam' ? 60 : 10" 
                      placeholder="-"
                      @focus="focusedRow = rIndex"
                      @blur="focusedRow = -1"
                      @keydown="(e) => handleKeyNav(e, rIndex, cIndex)"
                      @input="markDirty"
                      class="w-full h-9 rounded text-center text-sm font-bold focus:ring-2 focus:ring-[#09033B] focus:bg-white outline-none transition-all placeholder-gray-200 border border-transparent hover:border-gray-200"
                      :class="[
                        validateScore(row[field], field === 'exam' ? 60 : 10) ? 'text-gray-800' : 'text-red-600 bg-red-50 border-red-300',
                        field === 'exam' ? 'text-blue-900' : ''
                      ]"
                    />
                  </td>
                  
                  <td class="px-4 py-2 text-center font-black">
                    <span :class="getTotalColor(calculateTotal(row))">
                      {{ calculateTotal(row) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'remarks'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
           
           <div class="mb-10">
            <h3 class="font-bold text-lg text-gray-800 mb-6 border-b pb-2">Performance Metrics</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div>
                <label class="block text-xs font-bold text-red-600 uppercase mb-1">Days Absent</label>
                <input v-model.number="formData.summary.days_absent" @input="markDirty" type="number" min="0" class="w-full border-red-200 rounded-lg p-2.5 focus:ring-red-500 text-red-700 font-bold" />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Total Paces Completed</label>
                <input v-model="formData.summary.total_paces" @input="markDirty" type="text" class="w-full border-gray-300 rounded-lg p-2.5 focus:ring-[#09033B]" />
              </div>
              
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Pace Average</label>
                <input v-model="formData.summary.pace_average" @input="markDirty" type="text" class="w-full border-gray-300 rounded-lg p-2.5 focus:ring-[#09033B]" />
              </div>
              
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Next Term Begins</label>
                <input v-model="formData.summary.next_term_begins" @input="markDirty" type="date" class="w-full border-gray-300 rounded-lg p-2.5 focus:ring-[#09033B]" />
              </div>
            </div>
           </div>

           <div class="space-y-6">
             <h3 class="font-bold text-lg text-gray-800 border-b pb-2">Term Remarks</h3>
             <div>
               <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Class Teacher's Comment</label>
               <textarea v-model="formData.comments.teacher" @input="markDirty" rows="3" class="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-[#09033B]"></textarea>
             </div>
             <div>
               <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Head Teacher's Comment</label>
               <textarea v-model="formData.comments.principal" @input="markDirty" rows="3" class="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-[#09033B]"></textarea>
             </div>
           </div>
        </div>
      </div>

      <div class="fixed bottom-0 left-0 right-0 md:left-64 bg-white/90 backdrop-blur border-t border-gray-200 p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-4">
             <div v-if="isDirty" class="text-amber-600 font-bold text-xs flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
               <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
               Unsaved Changes
             </div>
             <div v-if="message" :class="error ? 'text-red-600' : 'text-green-600'" class="text-sm font-bold flex items-center gap-2">
                <UIcon :name="error ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle'" class="w-5 h-5" />
                {{ message }}
             </div>
          </div>

          <div class="flex gap-3">
            <button @click="resetForm" class="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors">Reset</button>
            <button 
              @click="saveResults" 
              :disabled="saving || loadingData" 
              class="bg-[#09033B] text-white px-8 py-2.5 rounded-lg shadow-lg hover:bg-blue-900 disabled:opacity-50 font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'

definePageMeta({ layout: 'teacher' })
const route = useRoute()
const router = useRouter()
const studentId = route.params.id

// --- 1. INITIAL FETCH ---
const { data: student } = await useFetch(`/api/teacher/student-details?id=${studentId}`)

//current school year

const  currentSchoolYear = ref('2025/2026')
const currentSchoolTerm = ref('2nd Term')


// --- 2. CONSTANTS & HELPERS ---
const LOWER_CLASS_SUBJECTS = ["Maths PACES", "English PACES", "Science PACES", "Soc. Stud. PACES", "Literature PACES", "World Building", "Literacy", "Numeracy", "Rhymes", "Social Studies", "Health Education", "Elementary Science", "Computer", "French", "Music", "Writing", "Civic Education", "Moral Instructions", "Fine Arts", "Bible Memory"]
const UPPER_CLASS_SUBJECTS = ["Maths PACES", "English PACES", "Science PACES", "Soc. Stud PACES", "Literature PACES", "World Building", "Nigerian Maths", "English Language", "BST- Basic Sci & Tech", "BST- PHE", "BST-Comp Science", "NV-Soc. Studies", "NV- Civic/Sec. Edu.", "C.R.K", "PVS- Agric. Science", "PVS- Home Economics", "French", "Vocational Apt.", "Verbal Reasoning", "Quantitative Apt.", "History", "Bible memory"]

const getSubjectsForClass = (className: string) => {
  if (!className) return UPPER_CLASS_SUBJECTS
  const lower = className.toLowerCase()
  if (lower.includes('playgroup') || lower.includes('nursery') || lower.includes('reading readiness') || lower.includes('creche')) {
    return LOWER_CLASS_SUBJECTS
  }
  return UPPER_CLASS_SUBJECTS
}

const generateBlankAcademics = () => {
  const subjects = getSubjectsForClass(student.value?.student?.class_level || '')
  return subjects.map(subject => ({
    subject: subject, ca1: '', ca2: '', assignment: '', class_ex: '', affective: '', psychomotor: '', exam: ''
  }))
}

// --- 3. STATE INITIALIZATION ---
const activeTab = ref('academic')
const saving = ref(false)
const loadingData = ref(false)
const message = ref('')
const error = ref(false)
const focusedRow = ref(-1)
const isDirty = ref(false)

const formData = ref({
  session: '2025/2026', term: '2nd Term', class_level: '', 
  academics: generateBlankAcademics(),
  summary: { 
    total_paces: '', 
    pace_average: '', 
    reading_comprehension: '', 
    next_term_begins: '', 
    days_absent: 0 
  },
  comments: { teacher: '', principal: '' }
})

// --- 4. NAVIGATION LOGIC ---
const fieldKeys = ['ca1', 'ca2', 'assignment', 'class_ex', 'affective', 'psychomotor', 'exam']
const headers = [
  { label: '1st CA', max: 10 }, { label: '2nd CA', max: 10 }, 
  { label: 'Assign', max: 10 }, { label: 'Class Ex', max: 10 }, 
  { label: 'Affective', max: 10 }, { label: 'Psych', max: 10 }
]

const handleKeyNav = (e: KeyboardEvent, rIndex: number, cIndex: number) => {
  let nextRow = rIndex
  let nextCol = cIndex

  switch(e.key) {
    case 'ArrowRight': nextCol++; break;
    case 'ArrowLeft': nextCol--; break;
    case 'ArrowUp': 
      e.preventDefault(); // FIX: Prevent number increment
      nextRow--; 
      break;
    case 'ArrowDown': 
      e.preventDefault(); // FIX: Prevent number decrement
      nextRow++; 
      break;
    case 'Enter': 
      e.preventDefault(); 
      nextRow++; 
      break;
    default: return; 
  }

  const totalRows = formData.value.academics.length
  const totalCols = fieldKeys.length

  if (nextRow >= 0 && nextRow < totalRows && nextCol >= 0 && nextCol < totalCols) {
    const el = document.getElementById(`cell-${nextRow}-${nextCol}`)
    if (el) el.focus()
  }
}

// --- 5. VALIDATION & CALCULATIONS ---
const validateScore = (val: any, max: number) => {
  if (val === '' || val === null) return true
  const num = Number(val)
  return num >= 0 && num <= max
}

const calculateTotal = (row: any) => {
  const fields = [...fieldKeys]
  const isEmpty = fields.every(key => row[key] === '' || row[key] === null)
  if (isEmpty) return ''
  
  const val = (n: any) => (n === '' || n === null) ? 0 : Number(n)
  return val(row.ca1) + val(row.ca2) + val(row.assignment) + val(row.class_ex) + 
         val(row.affective) + val(row.psychomotor) + val(row.exam)
}

const getTotalColor = (val: any) => {
  if (val === '') return 'text-gray-300'
  if (val > 100) return 'text-red-600 bg-red-100 px-2 rounded animate-pulse'
  return val < 40 ? 'text-red-600' : 'text-green-700'
}

// --- 6. API ACTIONS ---
const fetchExistingResults = async () => {
  loadingData.value = true; message.value = ''; isDirty.value = false;
  try {
    const data: any = await $fetch('/api/teacher/results', {
      method: 'GET',
      params: { student_id: studentId, session: formData.value.session, term: formData.value.term }
    })
    const subjectList = getSubjectsForClass(student.value?.student?.class_level || '')
    
    if (data.found && data.academics.length > 0) {
      const savedMap = new Map(data.academics.map((item: any) => [item.subject, item]))
      formData.value.academics = subjectList.map(subjectName => {
        if (savedMap.has(subjectName)) {
          const s = savedMap.get(subjectName)
          return { subject: subjectName, ca1: s.ca1, ca2: s.ca2, assignment: s.assignment, class_ex: s.class_ex, affective: s.affective, psychomotor: s.psychomotor, exam: s.exam }
        } else {
          return { subject: subjectName, ca1: '', ca2: '', assignment: '', class_ex: '', affective: '', psychomotor: '', exam: '' }
        }
      })
      formData.value.summary = { ...formData.value.summary, ...data.summary, next_term_begins: data.summary?.next_term_begins?.split('T')[0] || '' }
      formData.value.comments = data.comments
    } else {
      resetForm(false)
    }
  } catch (err) { error.value = true; message.value = 'Error loading records.' } 
  finally { loadingData.value = false }
}

const saveResults = async () => {
  saving.value = true; message.value = ''; error.value = false;
  try {
    const payload = { ...formData.value, student_id: studentId, class_level: student.value?.student.class_level || 'Unknown' }
    await $fetch('/api/teacher/results', { method: 'POST', body: payload })
    message.value = 'Changes saved!'; isDirty.value = false;
    setTimeout(() => { message.value = '' }, 4000)
  } catch (err: any) {
    error.value = true; message.value = err.data?.message || 'Failed to save.';
  } finally { saving.value = false }
}

const resetForm = (fullReload = true) => {
  formData.value.academics = generateBlankAcademics()
  formData.value.summary = { total_paces: '', pace_average: '', reading_comprehension: '', next_term_begins: '', days_absent: 0 }
  formData.value.comments = { teacher: '', principal: '' }
  isDirty.value = false
  if(fullReload) fetchExistingResults()
}

// --- 7. WATCHERS & LIFECYCLE ---
watch(student, (newVal) => {
  if (newVal && newVal.student) {
    if (!formData.value.academics.length || formData.value.academics[0].subject === 'Maths PACES') {
       formData.value.academics = generateBlankAcademics()
    }
  }
}, { immediate: true })

watch(() => [formData.value.session, formData.value.term], () => {
  fetchExistingResults()
}, { immediate: true })

// Unsaved Changes Guard
const markDirty = () => { isDirty.value = true }

const confirmExit = (to: string) => {
  if (isDirty.value) {
    if (confirm('You have unsaved changes. Leave anyway?')) {
      router.push(to)
    }
  } else {
    router.push(to)
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', (e) => {
    if (isDirty.value) e.returnValue = 'Unsaved changes'
  })
})

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value && !confirm('You have unsaved changes. Leave anyway?')) {
    next(false)
  } else {
    next()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>