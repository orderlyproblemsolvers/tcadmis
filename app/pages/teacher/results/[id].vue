<template>
  <div class="min-h-screen bg-gray-50 p-6 pb-24">
    <div class="max-w-7xl mx-auto">
      
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <NuxtLink to="/teacher/dashboard" class="text-sm text-gray-500 hover:text-primary-dark transition-colors">
            ← Back to Dashboard
          </NuxtLink>
          <div class="mt-2">
            <h1 class="text-2xl font-bold text-primary-dark">Result Entry</h1>
            <p v-if="student" class="text-gray-600">
              Student: <span class="font-bold text-black">{{ student.first_name }} {{ student.last_name }}</span> 
              <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded ml-2">{{ student.admission_number }}</span>
            </p>
            <p v-else class="text-gray-400 text-sm">Loading student details...</p>
          </div>
        </div>
        
        <div class="flex gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Academic Session</label>
            <select v-model="formData.session" class="border border-gray-300 p-2 rounded focus:ring-primary-dark focus:border-primary-dark text-sm font-medium w-40">
              <option>2025/2026</option>
              <option>2026/2027</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Term</label>
            <select v-model="formData.term" class="border border-gray-300 p-2 rounded focus:ring-primary-dark focus:border-primary-dark text-sm font-medium w-40">
              <option>1st Term</option>
              <option>2nd Term</option>
              <option>3rd Term</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex border-b border-gray-300 mb-6 bg-transparent">
        <button 
          @click="activeTab = 'academic'" 
          :class="['px-6 py-3 font-medium text-sm transition-all', activeTab === 'academic' ? 'border-b-2 border-primary-dark text-primary-dark bg-white rounded-t' : 'text-gray-500 hover:text-gray-700']"
        >
          1. Academic Scores
        </button>
        <button 
          @click="activeTab = 'remarks'" 
          :class="['px-6 py-3 font-medium text-sm transition-all', activeTab === 'remarks' ? 'border-b-2 border-primary-dark text-primary-dark bg-white rounded-t' : 'text-gray-500 hover:text-gray-700']"
        >
          2. Report Data & Remarks
        </button>
      </div>

      <div v-if="loadingData" class="py-12 text-center text-gray-500 bg-white rounded shadow">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dark mb-2"></div>
        <p>Fetching existing records...</p>
      </div>

      <div v-else>
        
        <div v-show="activeTab === 'academic'" class="bg-white rounded shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Subject</th>
                  <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">1st CA<br><span class="text-[10px]">(10)</span></th>
                  <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">2nd CA<br><span class="text-[10px]">(10)</span></th>
                  <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">Assign<br><span class="text-[10px]">(10)</span></th>
                  <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">Class Ex<br><span class="text-[10px]">(10)</span></th>
                  <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">Affective<br><span class="text-[10px]">(10)</span></th>
                  <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">Psych<br><span class="text-[10px]">(10)</span></th>
                  <th class="px-2 py-3 text-center text-xs font-bold text-blue-800 uppercase bg-blue-50 w-24">Exam<br><span class="text-[10px]">(40)</span></th>
                  <th class="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase w-24">Total<br><span class="text-[10px]">(100)</span></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in formData.academics" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="px-4 py-2 text-sm font-bold text-gray-700">
                    {{ row.subject }}
                  </td>
                  
                  <td v-for="field in ['ca1', 'ca2', 'assignment', 'class_ex', 'affective', 'psychomotor']" :key="field" class="px-2 py-2">
                    <input 
                      v-model="row[field]" 
                      type="number" min="0" max="10" 
                      placeholder="-"
                      class="w-full border-gray-300 rounded text-center text-sm focus:ring-primary-dark focus:border-primary-dark placeholder-gray-300" 
                    />
                  </td>
                  
                  <td class="px-2 py-2 bg-blue-50">
                    <input 
                      v-model="row.exam" 
                      type="number" min="0" max="40" 
                      placeholder="-"
                      class="w-full border-blue-300 rounded text-center text-sm font-bold text-blue-900 focus:ring-blue-500 focus:border-blue-500 placeholder-blue-300" 
                    />
                  </td>
                  
                  <td class="px-4 py-2 text-center font-bold text-gray-900">
                    <span :class="getTotalColor(calculateTotal(row))">
                      {{ calculateTotal(row) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'remarks'" class="bg-white rounded shadow p-8">
          
          <div class="mb-10">
            <h3 class="font-bold text-lg text-gray-800 mb-6 border-b pb-2">Attendance & Performance Metrics</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Paces Completed</label>
                <input v-model="formData.summary.total_paces" type="text" placeholder="e.g. 15" class="w-full border-gray-300 rounded p-2 focus:ring-primary-dark focus:border-primary-dark" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date & Pace Average</label>
                <input v-model="formData.summary.pace_average" type="text" placeholder="e.g. 12/10/25 - 4.5" class="w-full border-gray-300 rounded p-2 focus:ring-primary-dark focus:border-primary-dark" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reading Comprehension (WPM)</label>
                <input v-model="formData.summary.reading_comprehension" type="text" placeholder="e.g. 120 wpm" class="w-full border-gray-300 rounded p-2 focus:ring-primary-dark focus:border-primary-dark" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Days Absent</label>
                <input v-model.number="formData.summary.days_absent" type="number" min="0" class="w-full border-gray-300 rounded p-2 focus:ring-primary-dark focus:border-primary-dark" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Next Term Begins</label>
                <input v-model="formData.summary.next_term_begins" type="date" class="w-full border-gray-300 rounded p-2 focus:ring-primary-dark focus:border-primary-dark" />
              </div>

            </div>
          </div>

          <div class="space-y-8">
            <h3 class="font-bold text-lg text-gray-800 mb-6 border-b pb-2">Term Remarks</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Class Teacher's Comment</label>
              <textarea v-model="formData.comments.teacher" rows="4" class="w-full border-gray-300 rounded shadow-sm focus:ring-primary-dark focus:border-primary-dark p-3 text-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Head Teacher's Comment</label>
              <textarea v-model="formData.comments.principal" rows="4" class="w-full border-gray-300 rounded shadow-sm focus:ring-primary-dark focus:border-primary-dark p-3 text-sm"></textarea>
            </div>
          </div>

        </div>

      </div>

      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center">
            <div v-if="success" class="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200 transition-all">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              {{ message }}
            </div>
            <div v-if="error" class="text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200">
              {{ message }}
            </div>
          </div>

          <div class="flex gap-4">
            <button @click="resetForm" class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">Reset</button>
            <button 
              @click="saveResults" 
              :disabled="saving || loadingData" 
              class="bg-primary-dark text-white px-8 py-3 rounded shadow hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ saving ? 'Saving...' : 'Save All Changes' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const studentId = route.params.id

// --- INITIALIZATION ---
const { data: student } = await useFetch(`/api/teacher/student-details?id=${studentId}`)

const activeTab = ref('academic')
const saving = ref(false)
const loadingData = ref(false)
const message = ref('')
const success = ref(false)
const error = ref(false)

const STANDARD_SUBJECTS = [
  "Maths PACES", "English PACES", "Science PACES", "Soc. Stud PACES", 
  "Literature PACES", "World Building", "Nigerian Maths", "English Language",
  "BST- Basic Sci & Tech", "BST- PHE", "BST-Comp Science", "NV-Soc. Studies",
  "NV- Civic/Sec. Edu.", "C.R.K", "PVS- Agric. Science", "PVS- Home Economics",
  "French", "Vocational Apt.", "Verbal Reasoning", "Quantitative Apt.",
  "History", "Bible memory"
]

// Initialize with empty strings instead of 0
const generateBlankAcademics = () => {
  return STANDARD_SUBJECTS.map(subject => ({
    subject: subject,
    ca1: '', ca2: '', assignment: '', class_ex: '', affective: '', psychomotor: '', exam: ''
  }))
}

const formData = ref({
  session: '2025/2026',
  term: '1st Term',
  class_level: '', 
  academics: generateBlankAcademics(),
  summary: {
    total_paces: '',
    pace_average: '',
    reading_comprehension: '',
    days_absent: 0,
    next_term_begins: ''
  },
  comments: { teacher: '', principal: '' }
})

// --- DATA FETCHING ---
const fetchExistingResults = async () => {
  loadingData.value = true
  message.value = ''
  
  try {
    const data: any = await $fetch('/api/teacher/results', {
      method: 'GET',
      params: {
        student_id: studentId,
        session: formData.value.session,
        term: formData.value.term
      }
    })

    if (data.found && data.academics.length > 0) {
      const savedMap = new Map(data.academics.map((item: any) => [item.subject, item]))

      formData.value.academics = STANDARD_SUBJECTS.map(subjectName => {
        if (savedMap.has(subjectName)) {
          const s = savedMap.get(subjectName)
          return {
             subject: subjectName,
             ca1: s.ca1, ca2: s.ca2, assignment: s.assignment, class_ex: s.class_ex,
             affective: s.affective, psychomotor: s.psychomotor, exam: s.exam
          }
        } else {
          return { subject: subjectName, ca1: '', ca2: '', assignment: '', class_ex: '', affective: '', psychomotor: '', exam: '' }
        }
      })

      formData.value.summary = {
        total_paces: data.summary?.total_paces || '',
        pace_average: data.summary?.pace_average || '',
        reading_comprehension: data.summary?.reading_comprehension || '',
        days_absent: data.summary?.days_absent || 0,
        next_term_begins: data.summary?.next_term_begins ? new Date(data.summary.next_term_begins).toISOString().split('T')[0] : ''
      }
      
      formData.value.comments = data.comments
    } else {
      resetForm(false) 
    }

  } catch (err) {
    console.error('Fetch error:', err)
    error.value = true
    message.value = 'Error loading existing records.'
  } finally {
    loadingData.value = false
  }
}

watch(() => [formData.value.session, formData.value.term], () => {
  fetchExistingResults()
}, { immediate: true })

// --- HELPERS & ACTIONS ---
const resetForm = (fullReload = true) => {
  formData.value.academics = generateBlankAcademics()
  formData.value.summary = {
    total_paces: '', pace_average: '', reading_comprehension: '', days_absent: 0, next_term_begins: ''
  }
  formData.value.comments = { teacher: '', principal: '' }
  if(fullReload) fetchExistingResults()
}

const calculateTotal = (row: any) => {
  const fields = ['ca1', 'ca2', 'assignment', 'class_ex', 'affective', 'psychomotor', 'exam']
  
  const isEmpty = fields.every(key => 
    row[key] === '' || row[key] === null || row[key] === undefined
  )

  if (isEmpty) return ''

  const val = (n: any) => (n === '' || n === null) ? 0 : Number(n)
  
  const total = val(row.ca1) + val(row.ca2) + val(row.assignment) + val(row.class_ex) + 
                val(row.affective) + val(row.psychomotor) + val(row.exam)
                
  return total
}

const getTotalColor = (val: any) => {
  if (val === '') return 'text-gray-400'
  return val < 40 ? 'text-red-600' : 'text-green-700'
}

const saveResults = async () => {
  saving.value = true
  message.value = ''
  success.value = false
  error.value = false
  
  try {
    const payload = {
      ...formData.value,
      student_id: studentId,
      class_level: student.value?.student.class_level || 'Unknown'
    }
    

    await $fetch('/api/teacher/results', { method: 'POST', body: payload })
    
    success.value = true
    message.value = 'Results saved successfully!'
    setTimeout(() => { success.value = false; message.value = '' }, 4000)

  } catch (err: any) {
    error.value = true
    message.value = err.data?.message || 'Failed to save results.'
  } finally {
    saving.value = false
  }
}

</script>

<style scoped>
.text-primary-dark {
  color: #09033B;
}

.bg-primary-dark {
  background-color: #09033B;
}

.border-primary-dark {
  border-color: #09033B;
}

.focus\:ring-primary-dark:focus {
  --tw-ring-color: #09033B;
}

.focus\:border-primary-dark:focus {
  border-color: #09033B;
}

.hover\:text-primary-dark:hover {
  color: #09033B;
}
</style>