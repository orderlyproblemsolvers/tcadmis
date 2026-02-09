<template>
  <div class="relative max-w-5xl mx-auto p-4 sm:p-8 font-sans">
    
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-5 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-5 opacity-0"
    >
      <div v-if="toastMessage" class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-bold flex items-center gap-3"
        :class="toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
        <svg v-if="toastType === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5Z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0Zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5Zm0 10a1 1 0 100-2 1 1 0 000 2Z" clip-rule="evenodd" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="mb-8">
      <h1 class="text-3xl font-black text-[#09033B] tracking-tight">Registration Center</h1>
      <p class="text-gray-500 mt-1">Add new members to the school database.</p>
    </div>

    <div class="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
      <button 
        @click="activeTab = 'student'"
        class="whitespace-nowrap py-3 px-6 border-b-2 font-bold text-sm focus:outline-none transition-colors flex items-center gap-2"
        :class="activeTab === 'student' ? 'border-[#09033B] text-[#09033B]' : 'border-transparent text-gray-400 hover:text-gray-600'"
      >
        Register Student
      </button>
      <button 
        @click="activeTab = 'teacher'"
        class="whitespace-nowrap py-3 px-6 border-b-2 font-bold text-sm focus:outline-none transition-colors flex items-center gap-2"
        :class="activeTab === 'teacher' ? 'border-[#09033B] text-[#09033B]' : 'border-transparent text-gray-400 hover:text-gray-600'"
      >
        Register Staff
      </button>
    </div>

    <div v-if="activeTab === 'student'" class="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 class="text-xl font-bold mb-6 text-gray-900 border-b pb-4">New Student Profile</h2>
      
      <form @submit.prevent="submitStudent" class="space-y-8">
        
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <div class="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group hover:border-gray-400 transition-colors">
            <img v-if="studentForm.photo_url" :src="studentForm.photo_url" class="w-full h-full object-cover" />
            <div v-else class="text-gray-400 text-center p-2">
              <span class="text-[10px] uppercase font-bold">No Photo</span>
            </div>
            
            <div v-if="uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
               <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            </div>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-bold text-gray-700 mb-2">Student Passport Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              @change="(e) => handleFileUpload(e, 'student')" 
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#09033B]/10 file:text-[#09033B] hover:file:bg-[#09033B]/20 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">First Name</label>
              <input v-model="studentForm.first_name" type="text" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Last Name</label>
              <input v-model="studentForm.last_name" type="text" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Admission Number</label>
              <input v-model="studentForm.admission_number" type="text" placeholder="e.g. TCAD/2026/001" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none uppercase" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Assign to Class</label>
              <select v-model="studentForm.class_level" class="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-[#09033B] outline-none" required>
                <option value="" disabled>Select a Class...</option>
                <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Date of Birth</label>
              <input v-model="studentForm.dob" type="date" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none" />
            </div>
            
            <div class="bg-indigo-50 p-2 rounded-lg border border-indigo-100">
              <label class="block text-xs font-bold text-indigo-900 uppercase mb-1">Parent Access PIN</label>
              <div class="flex gap-2">
                <input 
                  v-model="studentForm.access_code" 
                  type="text" 
                  readonly 
                  placeholder="------" 
                  class="w-full border border-indigo-200 p-2 rounded-lg font-mono text-center text-lg font-bold tracking-widest bg-white text-indigo-900 focus:outline-none" 
                  required
                />
                <button type="button" @click="generateAccessCode" class="bg-indigo-600 text-white px-3 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
                  Generate
                </button>
              </div>
              <p class="text-[10px] text-indigo-500 mt-1 pl-1">Required for parents to check results.</p>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
              <div class="mt-2 flex gap-6">
                <label class="inline-flex items-center cursor-pointer">
                  <input type="radio" v-model="studentForm.gender" value="Male" class="text-[#09033B] focus:ring-[#09033B] h-4 w-4" />
                  <span class="ml-2 text-sm text-gray-700 font-medium">Male</span>
                </label>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="radio" v-model="studentForm.gender" value="Female" class="text-[#09033B] focus:ring-[#09033B] h-4 w-4" />
                  <span class="ml-2 text-sm text-gray-700 font-medium">Female</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Parent / Guardian Info</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
             <input v-model="studentForm.parent1_name" type="text" placeholder="Primary Contact Name" class="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#09033B] outline-none" />
             <input v-model="studentForm.parent1_phone" type="text" placeholder="Phone Number" class="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#09033B] outline-none" />
             <select v-model="studentForm.parent1_rel" class="border border-gray-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#09033B] outline-none">
                <option value="" disabled selected>Relationship</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option>
             </select>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Medical</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Allergies / Medical Notes</label>
              <textarea v-model="studentForm.allergies" rows="2" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none"></textarea>
            </div>
            <div class="flex items-center gap-3 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <input type="checkbox" v-model="studentForm.special_needs" id="special_needs" class="h-5 w-5 text-[#09033B] border-gray-300 rounded focus:ring-[#09033B]" />
              <label for="special_needs" class="text-sm font-bold text-gray-700 cursor-pointer select-none">Does this student require Special Needs attention?</label>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100">
          <button type="submit" :disabled="loading || uploading" class="w-full md:w-auto bg-[#09033B] text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-900 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-3">
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving Profile...' : 'Create Student Profile' }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="activeTab === 'teacher'" class="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 class="text-xl font-bold mb-6 text-gray-900 border-b pb-4">New Staff Profile</h2>
      <form @submit.prevent="submitTeacher" class="space-y-6">
        
        <div class="flex flex-col sm:flex-row gap-6 items-center border-b pb-6">
          <div class="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
            <img v-if="teacherForm.photo_url" :src="teacherForm.photo_url" class="w-full h-full object-cover" />
            <span v-else class="text-xs text-gray-400 font-bold uppercase">No Photo</span>
            
            <div v-if="uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
               <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            </div>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-bold text-gray-700 mb-1">Staff Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              @change="(e) => handleFileUpload(e, 'teacher')" 
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
            <input v-model="teacherForm.full_name" type="text" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Email (Login ID)</label>
            <input v-model="teacherForm.email" type="email" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
            <input v-model="teacherForm.phone" type="text" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Qualification</label>
            <select v-model="teacherForm.qualification" class="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-[#09033B] outline-none">
              <option>NCE</option>
              <option>B.Ed</option>
              <option>B.Sc</option>
              <option>M.Sc</option>
              <option>PhD</option>
              <option>SSCE</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Residential Address</label>
            <textarea v-model="teacherForm.address" rows="2" class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#09033B] outline-none"></textarea>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
           <label class="block text-sm font-bold text-blue-900 mb-1">Set Login Password</label>
           <div class="flex gap-2">
             <input v-model="teacherForm.password" type="text" class="flex-1 border border-blue-200 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500" required />
             <button type="button" @click="generatePassword" class="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 text-gray-700 shadow-sm transition-colors">Generate</button>
           </div>
           <p class="text-xs text-blue-700 mt-2 font-medium">Create this account, then copy the email and password to send to the staff member.</p>
        </div>

        <div class="pt-2">
          <button type="submit" :disabled="loading || uploading" class="w-full md:w-auto bg-[#09033B] text-white px-8 py-3 rounded-lg shadow-lg font-bold hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-3">
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating...' : 'Create Staff Profile' }}
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const activeTab = ref('student')
const loading = ref(false)
const uploading = ref(false)

// Toast State
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => toastMessage.value = '', 3000)
}

// --- CONFIGURATION ---
const CLOUD_NAME = 'dkw2vy90z' 
const UPLOAD_PRESET = 'tcad_students' 

// --- STUDENT FORM STATE ---
const studentForm = ref({
  first_name: '', last_name: '', admission_number: '', class_level: '',
  gender: 'Male', dob: '', photo_url: '',
  // ADDED ACCESS CODE FIELD
  access_code: '', 
  parent1_name: '', parent1_phone: '', parent1_rel: '',
  parent2_name: '', parent2_phone: '', parent2_rel: '',
  allergies: '', special_needs: false
})

// --- TEACHER FORM STATE ---
const teacherForm = ref({
  full_name: '', email: '', password: '', 
  photo_url: '', phone: '', address: '', qualification: 'NCE',
  guarantor_name: '', guarantor_phone: '', guarantor_rel: ''
})

const classes = [
  'Playgroup', 'Nursery 1', 'Nursery 2', 'Reading Readiness',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'
]

// --- GENERATORS ---
const generateAccessCode = () => {
  // Generate a 6-digit number
  const pin = Math.floor(100000 + Math.random() * 900000).toString()
  studentForm.value.access_code = pin
}

const generatePassword = () => {
  const randomPart = Math.random().toString(36).slice(-5);
  teacherForm.value.password = `${randomPart}-Tcad!`;
}

// --- CLOUDINARY UPLOAD LOGIC ---
const handleFileUpload = async (event: Event, type: 'student' | 'teacher') => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  
  if (file.size > 2 * 1024 * 1024) {
    showToast('File too large. Max 2MB.', 'error');
    return;
  }

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res: any = await $fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (type === 'student') {
      studentForm.value.photo_url = res.secure_url;
    } else {
      teacherForm.value.photo_url = res.secure_url;
    }
    
    showToast('Image uploaded successfully', 'success');
  } catch (error) {
    console.error(error);
    showToast('Image upload failed', 'error');
  } finally {
    uploading.value = false;
  }
};

// --- SUBMIT HANDLERS ---
const submitStudent = async () => {
  // Access Code Validation
  if (!studentForm.value.access_code) {
    showToast('Please generate an access PIN first.', 'error')
    return
  }

  loading.value = true;
  try {
    await $fetch('/api/admin/student-manage', { 
      method: 'POST', 
      body: { ...studentForm.value, action: 'create' } 
    });
    
    showToast(`Student ${studentForm.value.first_name} created!`, 'success');
    
    // Reset core fields
    studentForm.value.first_name = '';
    studentForm.value.last_name = '';
    studentForm.value.admission_number = '';
    studentForm.value.photo_url = '';
    studentForm.value.dob = '';
    studentForm.value.allergies = '';
    studentForm.value.access_code = ''; // Reset Access Code
    
  } catch (err: any) {
    showToast(err.data?.message || 'Failed to create student', 'error');
  } finally {
    loading.value = false;
  }
};

const submitTeacher = async () => {
  loading.value = true;
  try {
    await $fetch('/api/admin/users', { method: 'POST', body: teacherForm.value });
    
    showToast('Staff account created!', 'success');
    
    // Reset Form
    teacherForm.value = { 
      full_name: '', email: '', password: '', 
      photo_url: '', phone: '', address: '', qualification: 'NCE',
      guarantor_name: '', guarantor_phone: '', guarantor_rel: ''
    };
  } catch (err: any) {
    showToast(err.data?.message || 'Failed', 'error');
  } finally {
    loading.value = false;
  }
};
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