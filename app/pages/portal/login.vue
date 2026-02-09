<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
    
    <div class="max-w-7xl w-full">
      
      <!-- Header Section with Logo -->
      <div class="text-center mb-8 lg:mb-12">
        <img 
          src="/img/logo.png" 
          alt="The Covenant Academy Logo" 
          class="h-16 sm:h-20 w-auto mx-auto mb-4 sm:mb-6 drop-shadow-md"
        />
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight mb-3">
          The Covenant Academy
        </h1>
        <div class="h-1 w-20 bg-[#09033B] mx-auto rounded-full"></div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-start lg:items-center">
        
        <!-- Left Side: Banner & Welcome -->
        <div class="lg:col-span-3 space-y-6 lg:space-y-8">
          
          <!-- Banner Image -->
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#09033B] to-blue-900 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div class="relative">
              <img 
                src="/img/banner2.webp" 
                alt="The Covenant Academy Campus" 
                class="w-full h-64 sm:h-72 lg:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          <!-- Welcome Message -->
          <div class="space-y-4 lg:space-y-6 px-2 sm:px-4 lg:px-0">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 leading-snug">
              Welcome to the <span class="font-semibold text-[#09033B]">Parent Portal</span>
            </h2>
            <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
              We're delighted to have you here. Access your child's academic progress, 
              attendance records, and school updates all in one secure place.
            </p>
            <p class="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl">
              Your partnership in your child's educational journey matters deeply to us. 
              Together, we nurture excellence and character.
            </p>
          </div>
        </div>

        <!-- Right Side: Login Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 lg:p-10 border border-gray-100">
            
            <div class="mb-6 sm:mb-8">
              <h3 class="text-xl sm:text-2xl font-light text-gray-900 mb-2">Sign In</h3>
              <p class="text-sm text-gray-500">
                Enter your credentials to continue
              </p>
            </div>

            <form class="space-y-6" @submit.prevent="handleLogin">
              
              <!-- Admission Number Field -->
              <div>
                <label 
                  for="admission_number"
                  class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2"
                >
                  Admission Number
                </label>
                <input 
                  id="admission_number"
                  v-model="form.admission_number" 
                  type="text" 
                  required 
                  placeholder="TCAD/2026/001"
                  autocomplete="username"
                  :disabled="loading"
                  class="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#09033B] focus:ring-opacity-30 focus:border-[#09033B] transition-all uppercase text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  @input="clearError"
                />
              </div>

              <!-- Access PIN Field -->
              <div>
                <label 
                  for="access_code"
                  class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2"
                >
                  Access PIN
                </label>
                <div class="relative">
                  <input 
                    id="access_code"
                    v-model="form.access_code" 
                    :type="showPin ? 'text' : 'password'" 
                    required 
                    placeholder="••••••"
                    autocomplete="current-password"
                    :disabled="loading"
                    class="appearance-none block w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#09033B] focus:ring-opacity-30 focus:border-[#09033B] transition-all tracking-widest font-mono text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                    @input="clearError"
                  />
                  <button 
                    type="button"
                    @click="showPin = !showPin"
                    :disabled="loading"
                    :aria-label="showPin ? 'Hide PIN' : 'Show PIN'"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                  >
                    <svg v-if="!showPin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-5.985c.147-.381.146-.804 0-1.186A10.003 10.003 0 0010 3c-2.453 0-4.706.883-6.452 2.348l-1.32-1.321a.75.75 0 00-1.06 0zm9.776 9.776l-1.996-1.996A2.5 2.5 0 0110 12.5a2.5 2.5 0 01-.944-4.944l-1.996-1.996A3.992 3.992 0 005.65 10c0 1.25.57 2.368 1.465 3.123a3.99 3.99 0 003.885.877zM4.15 6.402a10.038 10.038 0 00-2.486 3.008c-.147.381-.146.804 0 1.186A10.003 10.003 0 0010 17c1.353 0 2.64-.326 3.792-.906l-1.31-1.31a3.99 3.99 0 01-3.132-.284A3.99 3.99 0 014.15 6.402z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p class="mt-2 text-xs text-gray-400">
                  Found on your child's admission letter
                </p>
              </div>

              <!-- Error Message -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 transform translate-y-1"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform translate-y-1"
              >
                <div v-if="error" class="text-red-600 text-sm font-medium bg-red-50 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 flex-shrink-0 mt-0.5">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0Zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5Zm0 10a1 1 0 100-2 1 1 0 000 2Z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ error }}</span>
                </div>
              </transition>

              <!-- Submit Button -->
              <button 
                type="submit" 
                :disabled="loading || !isFormValid"
                class="w-full flex items-center justify-center py-3.5 px-6 border border-transparent rounded-xl text-sm font-medium text-white bg-[#09033B] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09033B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="loading">Verifying credentials...</span>
                <span v-else>Access Dashboard</span>
              </button>
            </form>

            <!-- Help Section -->
            <div class="mt-6 sm:mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
              <p class="text-xs text-gray-500">
                Need assistance? Contact us at
              </p>
              <a 
                href="mailto:tcadinfo@gmail.com" 
                class="inline-flex items-center gap-2 text-sm font-medium text-[#09033B] hover:text-blue-900 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                <span class="group-hover:underline">tcadinfo@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="text-center mt-8 lg:mt-12 text-xs text-gray-400">
        <p>&copy; 2026 The Covenant Academy. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOgImageComponent('TcadMis', {
  title: 'Parent Portal',
  subtitle: 'Academic Excellence & Godly Education',
  label: 'Parent'
})

const router = useRouter()
const showPin = ref(false)
const loading = ref(false)
const error = ref('')

const form = ref({
  admission_number: '',
  access_code: ''
})

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return form.value.admission_number.trim().length > 0 && 
         form.value.access_code.trim().length > 0
})

// Clear error when user starts typing
const clearError = () => {
  if (error.value) {
    error.value = ''
  }
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const res: any = await $fetch('/api/portal/login', {
      method: 'POST',
      body: { 
        admission_number: form.value.admission_number.toUpperCase().trim(), 
        access_code: form.value.access_code.trim() 
      }
    })

    if (res.token) {
      const token = useCookie('parent_token', { maxAge: 60 * 60 * 24 }) 
      token.value = res.token
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push('/portal/dashboard')
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid credentials. Please check and try again.'
  } finally {
    loading.value = false
  }
}
</script>