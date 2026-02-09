<template>
  <div class="min-h-screen flex bg-gray-50">
    
    <!-- Left Side - Hero Image -->
    <div class="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
      <img 
        src="/img/banner.webp" 
        alt="TCAD Campus" 
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-[#09033B]/95 via-[#09033B]/85 to-[#09033B]/70">
        <div class="h-full flex flex-col justify-between p-12 xl:p-16">
          
          <!-- Logo & Branding -->
          <div class="flex items-center gap-4">
            <img src="/img/logo.png" alt="TCAD Logo" class="h-16 w-16 object-contain" />
            <div class="text-white">
              <h2 class="text-xl font-bold tracking-tight">The Covenant Academy</h2>
              <p class="text-sm opacity-80">Abuja, Nigeria</p>
            </div>
          </div>

          <!-- Hero Content -->
          <div class="text-white max-w-lg">
            <h1 class="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              Management<br/>Information<br/>System
            </h1>
            <p class="text-xl opacity-90 leading-relaxed">
              Streamlining excellence in godly education through modern academic management.
            </p>
          </div>

          <!-- Footer Quote -->
          <div class="text-white/70 text-sm italic border-l-2 border-white/30 pl-4">
            "To seek the exceptional, serve with humility"
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex-1 flex items-center justify-center p-6 md:p-12">
      <div class="w-full max-w-md">
        
        <!-- Mobile Logo (shown only on small screens) -->
        <div class="lg:hidden flex flex-col items-center mb-8">
          <img src="/img/logo.png" alt="TCAD Logo" class="h-20 w-20 mb-4 object-contain" />
          <h1 class="text-2xl font-bold text-[#09033B]">TCAD MIS</h1>
          <p class="text-gray-500 text-sm mt-1">Management Information System</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          
          <!-- Header -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p class="text-gray-500 text-sm">Please enter your credentials to continue</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="you@thecovenantacademy.org"
                  required
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#09033B] focus:border-[#09033B] transition-colors"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-lock-closed" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#09033B] focus:border-[#09033B] transition-colors"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="flex items-start gap-3 text-red-700 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
              <UIcon name="i-heroicons-exclamation-circle-solid" class="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{{ error }}</span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#09033B] text-white font-semibold py-3.5 px-4 rounded-lg hover:bg-[#09033B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09033B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              <UIcon v-if="loading" name="i-heroicons-arrow-path" class="h-5 w-5 animate-spin" />
              <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
            </button>

          </form>

          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-center text-xs text-gray-500 leading-relaxed">
              By signing in, you agree to our data protection policies.<br/>
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>

        <!-- Copyright -->
        <p class="text-center text-xs text-gray-400 mt-6">
          © {{ new Date().getFullYear() }} The Covenant Academy Abuja. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession()
const router = useRouter()

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

// Redirect if already logged in
if (loggedIn.value) {
  redirectUser(user.value)
}

function redirectUser(u: any) {
  if (u?.role === 'admin') router.push('/admin/dashboard')
  else if (u?.role === 'teacher') router.push('/teacher/dashboard')
  else router.push('/')
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    
    await refreshSession()
    
    if (user.value) {
      redirectUser(user.value)
    }
      
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Ensure smooth transitions */
input:focus {
  outline: none;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}
</style>