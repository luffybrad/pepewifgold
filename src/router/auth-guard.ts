import { useUserStore } from '@/stores/user'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore()
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup']
  
  // Check if route requires auth
  const requiresAuth = !publicRoutes.includes(to.path)

  // If route requires auth and user isn't authenticated
  if (requiresAuth) {
    // Try to verify authentication
    const isAuthenticated = await userStore.checkAuth()
    
    if (!isAuthenticated) {
      // Redirect to login with return URL
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // If user is authenticated and tries to access login/signup
  if (userStore.isAuthenticated && ['/login', '/signup'].includes(to.path)) {
    next('/')
    return
  }

  next()
} 