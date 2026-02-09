export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()
  const parentToken = useCookie('parent_token')
  const isParentLoggedIn = !!parentToken.value

  // --- 1. Root '/' Logic ---
  if (to.path === '/') {
    // If Staff is logged in
    if (loggedIn.value) {
      if (user.value?.role === 'admin') return navigateTo('/admin/dashboard')
      if (user.value?.role === 'teacher') return navigateTo('/teacher/dashboard')
    }
    // If Parent is logged in
    if (isParentLoggedIn) {
      return navigateTo('/portal/dashboard')
    }
    // No one logged in? Default to portal login (or your preference)
    return navigateTo('/portal/login')
  }

  // --- 2. Public / Guest Routes ---
  // Prevent logged-in users from hitting login pages again
  const isAuthPage = to.path === '/login' || to.path === '/portal/login'
  
  if (isAuthPage) {
    if (loggedIn.value) {
      if (user.value?.role === 'admin') return navigateTo('/admin/dashboard')
      if (user.value?.role === 'teacher') return navigateTo('/teacher/dashboard')
    }
    if (isParentLoggedIn) return navigateTo('/portal/dashboard')
    return // Allow access if not logged in
  }

  // --- 3. Protect Parent Portal Routes ---
  if (to.path.startsWith('/portal') && !isParentLoggedIn) {
    return navigateTo('/portal/login')
  }

  // --- 4. Protect Staff/Admin Routes ---
  // If they aren't logged in via the staff system, send them to staff login
  if ((to.path.startsWith('/admin') || to.path.startsWith('/teacher')) && !loggedIn.value) {
    return navigateTo('/login')
  }

  // --- 5. Role-Based Access Control (RBAC) ---
  
  // Protect Admin Routes
  if (to.path.startsWith('/admin') && user.value?.role !== 'admin') {
    return navigateTo('/') 
  }

  // Protect Teacher Routes (Admin can usually access)
  if (to.path.startsWith('/teacher') && user.value?.role !== 'teacher' && user.value?.role !== 'admin') {
    return navigateTo('/')
  }

  // Protect Report Pages (Optional: Ensure only relevant roles or parent can see it)
  // If you want parents to see /report/[id], we allow it if they have the parent token
  if (to.path.startsWith('/report') && !loggedIn.value && !isParentLoggedIn) {
    return navigateTo('/portal/login')
  }
})