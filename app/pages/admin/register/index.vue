<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-8">
    <UNotifications />

    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#09033B]">Registration Center</h1>
      <p class="text-gray-500">Add new members to the school database.</p>
    </div>

    <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
      <button 
        @click="activeTab = 'student'"
        :class="[activeTab === 'student' ? 'border-[#09033B] text-[#09033B]' : 'border-transparent text-gray-500', 'whitespace-nowrap py-4 px-6 border-b-2 font-medium focus:outline-none transition-colors']"
      >
        Register Student
      </button>
      <button 
        @click="activeTab = 'teacher'"
        :class="[activeTab === 'teacher' ? 'border-[#09033B] text-[#09033B]' : 'border-transparent text-gray-500', 'whitespace-nowrap py-4 px-6 border-b-2 font-medium focus:outline-none transition-colors']"
      >
        Register Staff
      </button>
    </div>

    <div v-if="activeTab === 'student'" class="bg-white p-6 rounded shadow-lg border border-gray-100">
      <h2 class="text-xl font-semibold mb-6 text-gray-800">New Student Profile</h2>
      
      <form @submit.prevent="submitStudent" class="space-y-8">
        
        <div class="flex flex-col sm:flex-row gap-6 items-start border-b pb-6">
          <div class="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
            <img v-if="studentForm.photo_url" :src="studentForm.photo_url" class="w-full h-full object-cover" />
            <div v-else class="text-gray-400 text-center p-2">
              <UIcon name="i-heroicons-camera" class="w-8 h-8 mx-auto mb-1" />
              <span class="text-[10px] uppercase font-bold">No Photo</span>
            </div>
            <div v-if="uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
               <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-bold text-gray-700 mb-2">Student Passport Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              @change="(e) => handleFileUpload(e, 'student')" 
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="text-xs text-gray-500 mt-2">Recommended: Square JPG/PNG, Max 2MB.</p>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input v-model="studentForm.first_name" type="text" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input v-model="studentForm.last_name" type="text" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input v-model="studentForm.dob" type="date" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <div class="mt-2 flex gap-4">
                <label class="inline-flex items-center cursor-pointer">
                  <input type="radio" v-model="studentForm.gender" value="Male" class="text-[#09033B] focus:ring-[#09033B]" />
                  <span class="ml-2 text-sm text-gray-700">Male</span>
                </label>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="radio" v-model="studentForm.gender" value="Female" class="text-[#09033B] focus:ring-[#09033B]" />
                  <span class="ml-2 text-sm text-gray-700">Female</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Admission Number</label>
              <input v-model="studentForm.admission_number" type="text" placeholder="e.g. TCAD/2026/001" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Assign to Class</label>
              <select v-model="studentForm.class_level" class="w-full border border-gray-300 p-2 rounded mt-1 bg-white focus:ring-[#09033B]" required>
                <option value="" disabled>Select a Class...</option>
                <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Parent / Guardian Info</h3>
          <div class="bg-gray-50 p-4 rounded mb-4 border border-gray-100">
            <p class="text-sm font-bold text-[#09033B] mb-2">Primary Contact</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input v-model="studentForm.parent1_name" type="text" placeholder="Full Name" class="border border-gray-300 p-2 rounded text-sm focus:ring-[#09033B]" />
              <input v-model="studentForm.parent1_phone" type="text" placeholder="Phone Number" class="border border-gray-300 p-2 rounded text-sm focus:ring-[#09033B]" />
              <select v-model="studentForm.parent1_rel" class="border border-gray-300 p-2 rounded text-sm bg-white focus:ring-[#09033B]">
                <option value="" disabled selected>Relationship</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option>
              </select>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded border border-gray-100">
            <p class="text-sm font-bold text-[#09033B] mb-2">Secondary Contact (Optional)</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input v-model="studentForm.parent2_name" type="text" placeholder="Full Name" class="border border-gray-300 p-2 rounded text-sm focus:ring-[#09033B]" />
              <input v-model="studentForm.parent2_phone" type="text" placeholder="Phone Number" class="border border-gray-300 p-2 rounded text-sm focus:ring-[#09033B]" />
              <select v-model="studentForm.parent2_rel" class="border border-gray-300 p-2 rounded text-sm bg-white focus:ring-[#09033B]">
                <option value="" disabled selected>Relationship</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Medical & Additional Info</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Allergies / Dietary Restrictions</label>
              <textarea v-model="studentForm.allergies" rows="2" placeholder="e.g. Peanuts, Lactose Intolerant, Asthmatic..." class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]"></textarea>
            </div>
            <div class="flex items-center gap-2 bg-yellow-50 p-3 rounded border border-yellow-100">
              <input type="checkbox" v-model="studentForm.special_needs" id="special_needs" class="h-4 w-4 text-[#09033B] border-gray-300 rounded focus:ring-[#09033B]" />
              <label for="special_needs" class="text-sm font-bold text-gray-700 cursor-pointer">Does this student require Special Needs attention?</label>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100">
          <button type="submit" :disabled="loading || uploading" class="w-full md:w-auto bg-[#09033B] text-white px-8 py-3 rounded shadow hover:bg-opacity-90 disabled:opacity-50 transition-all font-bold flex items-center justify-center gap-2">
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ loading ? 'Saving Profile...' : 'Create Student Profile' }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="activeTab === 'teacher'" class="bg-white p-6 rounded shadow-lg border border-gray-100">
      <h2 class="text-xl font-semibold mb-6 text-gray-800">New Staff Profile</h2>
      
      <form @submit.prevent="submitTeacher" class="space-y-6">
        
        <div class="flex flex-col sm:flex-row gap-6 items-center border-b pb-6">
          <div class="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
            <img v-if="teacherForm.photo_url" :src="teacherForm.photo_url" class="w-full h-full object-cover" />
            <UIcon v-else name="i-heroicons-user" class="w-8 h-8 text-gray-400" />
            
            <div v-if="uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
               <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            </div>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-bold text-gray-700 mb-1">Staff Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              @change="(e) => handleFileUpload(e, 'teacher')" 
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input v-model="teacherForm.full_name" type="text" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email (Login ID)</label>
            <input v-model="teacherForm.email" type="email" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input v-model="teacherForm.phone" type="text" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Qualification</label>
            <select v-model="teacherForm.qualification" class="w-full border border-gray-300 p-2 rounded mt-1 bg-white focus:ring-[#09033B]">
              <option>NCE</option>
              <option>B.Ed</option>
              <option>B.Sc</option>
              <option>M.Sc</option>
              <option>PhD</option>
              <option>SSCE</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Residential Address</label>
            <textarea v-model="teacherForm.address" rows="2" class="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-[#09033B]"></textarea>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 class="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Guarantor Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
             <input v-model="teacherForm.guarantor_name" type="text" placeholder="Guarantor Name" class="border border-gray-300 p-2 rounded text-sm focus:ring-[#09033B]" />
             <input v-model="teacherForm.guarantor_phone" type="text" placeholder="Phone Number" class="border border-gray-300 p-2 rounded text-sm focus:ring-[#09033B]" />
             <input v-model="teacherForm.guarantor_rel" type="text" placeholder="Relationship" class="border border-gray-300 p-2 rounded text-sm focus:ring-[#09033B]" />
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded border border-blue-100">
           <label class="block text-sm font-bold text-blue-900 mb-1">Set Login Password</label>
           <div class="flex gap-2">
             <input v-model="teacherForm.password" type="text" class="flex-1 border border-blue-200 p-2 rounded text-sm" required />
             <button type="button" @click="generatePassword" class="bg-white border border-gray-300 px-3 py-1 rounded text-sm font-medium hover:bg-gray-50 text-gray-700">Generate</button>
           </div>
           <p class="text-xs text-blue-700 mt-2">Create this account, then copy the email and password to send to the staff member.</p>
        </div>

        <div class="pt-2">
          <button type="submit" :disabled="loading || uploading" class="w-full md:w-auto bg-[#09033B] text-white px-8 py-3 rounded shadow font-bold hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ loading ? 'Creating...' : 'Create Staff Profile' }}
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
const toast = useToast()

const activeTab = ref('student')
const loading = ref(false)
const uploading = ref(false)

// --- CONFIGURATION ---
const CLOUD_NAME = 'dkw2vy90z' 
const UPLOAD_PRESET = 'tcad_students' 

// --- STUDENT FORM STATE ---
const studentForm = ref({
  first_name: '', last_name: '', admission_number: '', class_level: '',
  gender: 'Male', dob: '', photo_url: '',
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
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'
]

// --- CLOUDINARY UPLOAD LOGIC ---
const handleFileUpload = async (event: Event, type: 'student' | 'teacher') => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  
  if (file.size > 2 * 1024 * 1024) {
    toast.add({ title: 'File too large', description: 'Image must be under 2MB', color: 'red' });
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
    
    toast.add({ title: 'Upload Complete', color: 'green' });
  } catch (error) {
    console.error(error);
    toast.add({ title: 'Upload Failed', description: 'Could not upload image to Cloudinary', color: 'red' });
  } finally {
    uploading.value = false;
  }
};

// --- SUBMIT HANDLERS ---
const submitStudent = async () => {
  loading.value = true;
  try {
    await $fetch('/api/admin/student-manage', { 
      method: 'POST', 
      body: { ...studentForm.value, action: 'create' } 
    });
    
    toast.add({ title: 'Success', description: `Student ${studentForm.value.first_name} created!`, color: 'green' });
    
    // Reset core fields
    studentForm.value.first_name = '';
    studentForm.value.last_name = '';
    studentForm.value.admission_number = '';
    studentForm.value.photo_url = '';
    studentForm.value.dob = '';
    studentForm.value.allergies = '';
    
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to create student', color: 'red' });
  } finally {
    loading.value = false;
  }
};

const submitTeacher = async () => {
  loading.value = true;
  try {
    // Calling the updated endpoint that handles both users and profiles_teacher tables
    await $fetch('/api/admin/users', { method: 'POST', body: teacherForm.value });
    
    toast.add({ title: 'Success', description: 'Staff account created!', color: 'green' });
    
    // Reset Form
    teacherForm.value = { 
      full_name: '', email: '', password: '', 
      photo_url: '', phone: '', address: '', qualification: 'NCE',
      guarantor_name: '', guarantor_phone: '', guarantor_rel: ''
    };
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed', color: 'red' });
  } finally {
    loading.value = false;
  }
};

const generatePassword = () => {
  const randomPart = Math.random().toString(36).slice(-5);
  teacherForm.value.password = `${randomPart}-Tcad!`;
};
</script>