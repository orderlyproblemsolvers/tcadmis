// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()

  // 1. If they hit the root '/'
  if (to.path === '/') {
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
    // Redirect based on role
    if (user.value?.role === 'admin') return navigateTo('/admin/dashboard')
    if (user.value?.role === 'teacher') return navigateTo('/teacher/dashboard')
  }

  // 2. Not logged in? Go to login (unless they are already going there)
  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // 3. Prevent logged-in users from going back to the login page
  if (loggedIn.value && to.path === '/login') {
    if (user.value?.role === 'admin') return navigateTo('/admin/dashboard')
    if (user.value?.role === 'teacher') return navigateTo('/teacher/dashboard')
  }

  // 4. Protect Admin Routes
  if (to.path.startsWith('/admin') && user.value?.role !== 'admin') {
    return navigateTo('/') 
  }

  // 5. Protect Teacher Routes (Admin can also access teacher routes usually)
  if (to.path.startsWith('/teacher') && user.value?.role !== 'teacher' && user.value?.role !== 'admin') {
    return navigateTo('/')
  }
})