import { useUserStore } from '@/stores/user'

export async function requireAuth(to: any, from: any, next: any) {
  const userStore = useUserStore()
  
  if (!userStore.isAuthenticated) {
    // Save the intended destination
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export function requireGuest(to: any, from: any, next: any) {
  const userStore = useUserStore()
  
  if (userStore.isAuthenticated) {
    next({ path: '/' })
  } else {
    next()
  }
} 