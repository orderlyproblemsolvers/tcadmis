<template>
  <div class="min-h-screen bg-gray-100 p-4 print:p-0">
    
    <div class="max-w-[297mm] mx-auto mb-4 flex justify-between items-center print:hidden">
      <NuxtLink :to="backLink" class="text-gray-600 hover:text-[#09033B] text-sm flex items-center gap-1 font-bold">
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to Dashboard
      </NuxtLink>
      
      <div class="flex gap-3 items-center">
        <select v-model="session" class="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:ring-[#09033B]">
          <option>2025/2026</option>
          <option>2026/2027</option>
        </select>
        <select v-model="term" class="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:ring-[#09033B]">
          <option>1st Term</option>
          <option>2nd Term</option>
          <option>3rd Term</option>
        </select>

        <button 
          @click="downloadPDF" 
          :disabled="isGenerating"
          class="text-white px-4 py-2 rounded shadow font-bold text-sm flex items-center disabled:opacity-50 transition-all"
          style="background-color: #09033B;"
        >
          <UIcon v-if="isGenerating" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
          <UIcon v-else name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
          {{ isGenerating ? 'Generating...' : 'Download PDF' }}
        </button>
      </div>
    </div>

    <div ref="reportContent" class="w-[297mm] h-[210mm] mx-auto shadow-2xl relative flex" 
         style="background-color: #ffffff; color: #000000; font-family: 'Times New Roman', Times, serif; overflow: hidden;">
      
      <div style="width: 80%; margin: 7px; padding: 25px; display: flex; flex-direction: column;border-radius: 2%; border: 2px solid #000;">
        
       <div class="flex items-center justify-between border-b-2 pb-3 mb-3" style="border-bottom-color: #000000;">
  <div class="flex-1 flex items-center gap-4">
    <img 
      id="schoolLogoMain" 
      src="/img/logo.png" 
      alt="TCAD Logo" 
      class="h-14 w-14 object-contain" 
      crossorigin="anonymous" 
    />
    <div>
      <h1 style="font-size: 22px; font-weight: 900; color: #000000; margin: 0; text-transform: uppercase; font-family: 'EB Garamond', serif;">
        The Covenant Academy
      </h1>
      <p style="font-size: 9px; font-weight: bold; color: #4b5563; margin: 0; letter-spacing: 1px; font-family: 'EB Garamond', serif;">
        ......The School of Tomorrow
      </p>
    </div>
  </div>

  <div class="text-right">
    <div style="background-color: #000000; color: #ffffff; padding: 4px 12px; font-weight: 700; text-transform: uppercase; font-size: 11px;">
      {{ term }} PROGRESS REPORT | {{ session }}
    </div>
  </div>
</div>

        <div v-if="data" class="grid grid-cols-4 gap-2 mb-3 p-2 rounded" style="background-color: #ffffff; font-size: 10px; font-family: 'Times New Roman', Times, serif;">
          <div class="border-r border-gray-300 pr-2">
            <p style="color: #666; font-size: 8px; font-weight: bold;">STUDENT NAME</p>
            <p style="font-weight: 900; text-transform: uppercase;">{{ data.student.last_name }}, {{ data.student.first_name }}</p>
          </div>
          <div class="border-r border-gray-300 px-2">
            <p style="color: #666; font-size: 8px; font-weight: bold;">ADMISSION NO</p>
            <p style="font-weight: 900;">{{ data.student.admission_number }}</p>
          </div>
          <div class=" px-2">
            <p style="color: #666; font-size: 8px; font-weight: bold;">CLASS</p>
            <p style="font-weight: 900;">{{ data.student.class_level }}</p>
          </div>
        </div>

        <div style="flex: 1;">
          <table style="width: 100%; border-collapse: collapse; font-size: 8.5px;">
<thead>
  <tr style="background-color: #f5f5f5;">
    <th style=" font-weight: 800; padding: 4px; text-align: left; vertical-align: middle;">
      SUBJECT
    </th>

    <th colspan="2" style=" font-weight: 600; padding: 2px; text-align: center;">
      COGNITIVE 20%/40%
    </th>
    <th colspan="4" style=" font-weight: 600; padding: 2px; text-align: center;">
    </th>

    <th style=" font-weight: 800; text-align: center; background-color: #f5f5f5; width: 8%; vertical-align: middle;">
      EXAM
    </th>
    <th style=" font-weight: 800; text-align: center; width: 8%; background-color: #ff8080; vertical-align: middle;">
      TOTAL
    </th>
    <th style=" font-weight: 800; text-align: center; width: 6%; vertical-align: middle;">
      GRADE
    </th>
  </tr>

  <tr style="background-color: #f5f5f5; font-size: 7.5px;">
    <th style=" border-top: none; height: 0px; padding: 0;"></th> 
    
    <th style="font-size: 9.5px; font-weight: 700; padding: 5px 4px; width: 8%;">1st CA</th>
    <th style="font-size: 9.5px; font-weight: 700; padding: 5px 4px; width: 8%;">2nd CA</th>
    <th style="font-size: 9.5px; font-weight: 700; padding: 5px 4px; width: 8%;">Assgnment</th>
    <th style="font-size: 9.5px; font-weight: 700; padding: 5px 4px; width: 8%;">Class Exercise</th>
    <th style="font-size: 9.5px; font-weight: 700; padding: 5px 4px; width: 8%;">Affective</th>
    <th style="font-size: 9.5px; font-weight: 700; padding: 5px 4px; width: 8%;">Psycomotor</th>
    <th style="font-size: 9px;  font-weight: 800; text-align: center; width: 8%; background-color: #f5f5f5; vertical-align: middle;">40/60</th>
    <th style="font-size: 9px;  font-weight: 800; text-align: center; width: 8%; background-color: #ff8080; vertical-align: middle;">100</th>
    <th style=" border-top: none; height: 0px; padding: 0;"></th>
  </tr>
</thead>
            <tbody>
              <tr v-for="sub in data?.academics" :key="sub.subject" style="font-family: 'Times New Roman', Times, serif;">
                <td style=" padding: 1.5px 5px; font-weight: 600; font-size: 11px;">{{ sub.subject }}</td>
                <td v-for="key in ['ca1', 'ca2', 'assignment', 'class_ex', 'affective', 'psychomotor']" :key="key" style=" text-align: center; font-size: 12px;">
                  {{ formatScore(sub[key]) }}
                </td>
                <td style=" font-size:12px; text-align: center; padding-bottom: 2px; font-weight: 700; background-color: #f9fafb;">{{ formatScore(sub.exam) }}</td>
                <td style=" font-size:12px; text-align: center; padding-bottom: 2px; font-weight: 700; background-color: #ff8080;">{{ getDisplayTotal(sub) }}</td>
                <td style=" font-size:12px; text-align: center; padding-bottom: 2px; font-weight: 700;">{{ getDisplayTotal(sub) ? getGrade(sub.total) : '' }}</td>
              </tr>
              <tr v-for="i in Math.max(0, 18 - (data?.academics?.length || 0))" :key="'empty'+i">
                <td v-for="c in 10" :key="c" style="border: 1px solid #000; height: 16px;"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 10px; border-top: 2px solid #000; padding-top: 10px;">
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1; border: 1px solid #ccc; padding: 5px;">
              <p style="font-size: 8px; font-weight: 900; margin-bottom: 3px;">GRADING KEY</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; font-size: 7.5px; font-weight: bold;">
                <div style="display: flex; flex-direction: column;">
                  <span>EXC: EXCELLENT</span>
                  <span>VG: VERY GOOD</span>
                  <span>G: GOOD</span>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <span>S: SATISFACTORY</span>
                  <span>NI: NEEDS IMPROVEMENT</span>
                  <span>NGI: NEEDS GREAT IMPROVEMENT</span>
                </div>
              </div>
            </div>

            <div style="flex: 1.5; border: 1px solid #000; padding: 5px; background-color: #fcfcfc; font-family: 'Times New Roman', Times, serif;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: x-4; font-size: 10px; font-weight: bold;">
                <div>
                  <p>TOTAL PACES: <span style="font-weight: 900; color: #000;">{{ data?.meta?.total_paces || '--' }}</span></p>
                  <p>PACE AVERAGE: <span style="font-weight: 900; color: #000;">{{ data?.meta?.pace_average || '--' }}</span></p>
                  <p>READING COMP.: <span style="font-weight: 900; color: #000;">{{ data?.meta?.reading_comprehension || '--' }}</span></p>
                </div>
                <div style="text-align: right;">
                  <p>DAYS ABSENT: <span style="font-weight: 900; color: #000000;">{{ data?.meta?.days_absent || '0' }}</span></p>
                  <p>NEXT TERM BEGINS: <span style="font-weight: 900; color: #000000;">{{ formatDate(data?.meta?.next_term_begins) }}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 5px; font-family: 'Times New Roman', Times, serif;">
             <div style="font-size: 8px; color: #555; width: 40%;">
               <p>* Class Exercise: Quiz, Debates, Projects.</p>
               <p>* Affective: Attendance, Appearance, Honesty, Punctuality.</p>
               <p>* Psychomotor: Note copying, Practicals, Clubs.</p>
             </div>
             <div style="display: flex; gap: 30px;">
                <div style="text-align: center; width: 110px; border-top: 1px solid #000; font-size: 8px; font-weight: bold; padding-top: 2px;">GENERAL COMMENTS</div>
                <div style="text-align: center; width: 110px; border-top: 1px solid #000; font-size: 8px; font-weight: bold; padding-top: 2px;">PRINCIPAL SIGNATURE</div>
                <div style="text-align: center; width: 110px; border-top: 1px solid #000; font-size: 8px; font-weight: bold; padding-top: 2px;">PARENT SIGNATURE</div>
             </div>
          </div>
        </div>
      </div>

      <div style="width: 20%; background-color: #fdfdfd; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 30px 5px; font-family: 'Times New Roman', Times, serif;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center;">
          <h3 style="font-weight: 700; font-size: 16px; color: #000000;  text-transform: uppercase; letter-spacing: 1.5px;  padding-bottom: 5px;">The Way of <span style="background: black; color: #ffffff; padding-top: 20px; padding-bottom: 8px;">TCA</span></h3>
          <div style="display: flex; gap: 2px;">
            <div style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
            <div style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
            <div style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
            <div style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
            <div style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
            <div style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
            <div style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
          </div>
          <div v-for="(line, index) in wayOfTca" :key="index" style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <p style="font-size: 14px; font-weight: 500; text-transform: uppercase; color: #1e293b; margin: 0; line-height: 1.3; max-width: 150px; ">{{ line }}</p>
            <div v-if="index < wayOfTca.length - 1" style="width: 5px; height: 5px; background-color: #000000; border-radius: 50%;"></div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
          <img src="/img/logo.png" alt="TCAD Logo" class="h-28 w-28 object-contain" crossorigin="anonymous" />
          <div style="width: 100px; height: 60px; background-color: #000000;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const { user } = useUserSession()
const route = useRoute()
const studentId = route.params.id

const session = ref('2025/2026')
const term = ref('1st Term')
const isGenerating = ref(false)
const reportContent = ref(null)

const wayOfTca = [
  "to seek the exceptional",
  "to serve with humility",
  "to live with tolerance",
  "to care with compassion",
  "to work in unity",
  "to give with joyfulness",
  "to work in the fear of the lord",
  "that is the way of tca"
]

const { data, refresh } = await useFetch('/api/report-card', {
  params: { student_id: studentId, session, term }
})

watch([session, term], () => refresh())

const userRole = computed(() => user.value?.role || 'teacher')
const backLink = computed(() => userRole.value === 'admin' ? `/admin/students/${studentId}` : '/teacher/dashboard')

const hasAnyScore = (sub: any) => {
  const fields = ['ca1', 'ca2', 'assignment', 'class_ex', 'affective', 'psychomotor', 'exam']
  return fields.some(f => sub[f] !== null && sub[f] !== undefined && sub[f] !== '' && sub[f] !== 0 && sub[f] !== '0')
}

const getDisplayTotal = (sub: any) => {
  if (!hasAnyScore(sub)) return ''
  return (sub.total === 0 || sub.total === '0') ? '' : sub.total
}

const formatScore = (val: any) => {
  if (val === null || val === undefined || val === '' || val === 0 || val === '0') return '';
  return val;
}

const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString() : 'TBA'

const getGrade = (s: number) => {
  if (s >= 80) return 'EXC';
  if (s >= 70) return 'VG';
  if (s >= 60) return 'G';
  if (s >= 55) return 'S';
  if (s >= 50) return 'NI';
  return 'NGI';
}

const downloadPDF = async () => {
  if (!reportContent.value) return
  isGenerating.value = true
  
  try {
    // Wait for fonts and images to load
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const element = reportContent.value
    
    // OPTIMIZED html2canvas options
    const canvas = await html2canvas(element, {
      scale: 4,              // ✅ Keep this - good balance of quality/performance
      useCORS: true,         // ✅ Required for external images
      allowTaint: false,     // ⭐ NEW - prevents tainted canvas issues
      backgroundColor: '#ffffff',
      logging: false,        // Set to true for debugging
      
      // ⭐ QUALITY IMPROVEMENTS:
      windowWidth: element.scrollWidth,   // Capture full width
      windowHeight: element.scrollHeight, // Capture full height
      width: element.offsetWidth,
      height: element.offsetHeight,
      
      // ⭐ RENDERING IMPROVEMENTS:
      imageTimeout: 0,       // No timeout for image loading
      removeContainer: true, // Clean up after rendering
      letterRendering: true, // Better text rendering (can be slower)
      
      // ⭐ OPTIONAL - for very crisp text:
      // scale: 4,           // Higher quality but slower & larger file
      // dpi: 300,           // Doesn't exist in html2canvas, but scale handles this
    })
    
    const imgData = canvas.toDataURL('image/png', 1.0) // ⭐ 1.0 = maximum PNG quality
    
    // OPTIMIZED jsPDF options
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,  // ⭐ NEW - compress PDF (smaller file size)
      precision: 2,    // ⭐ NEW - coordinate precision
      hotfixes: ['px_scaling'] // ⭐ NEW - fixes pixel scaling issues
    })
    
    // ⭐ BETTER IMAGE EMBEDDING:
    pdf.addImage(
      imgData, 
      'PNG', 
      0, 0, 
      297, 210, 
      undefined,        // alias
      'FAST'           // ⭐ Compression method: 'NONE', 'FAST', 'MEDIUM', 'SLOW'
    )
    
    const fileName = `${data.value?.student?.last_name || 'Report'}_Progress_Report_${session.value}_${term.value}.pdf`
    pdf.save(fileName)
    
  } catch (err: any) {
    console.error('PDF Generation Error:', err)
    alert(`PDF Failed: ${err.message}`)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style>
/* Import EB Garamond from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
</style>