import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_URL } from '@/config/api'

interface User {
  id: number
  username: string
  email: string
  coins: number
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  async function initializeAuth() {
    if (token.value) {
      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          user.value = data.user
        } else {
          await logout()
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        await logout()
      }
    }
  }

  async function login(username: string) {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function addCoins(amount: number, taskType: string) {
    if (!token.value) throw new Error('Not authenticated')

    try {
      const response = await fetch(`${API_URL}/add-coins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify({ amount, taskType })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      if (user.value) {
        user.value.coins = data.newBalance
      }
    } catch (error) {
      console.error('Failed to add coins:', error)
      throw error
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    addCoins,
    initializeAuth
  }
})