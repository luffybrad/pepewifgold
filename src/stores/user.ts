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

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Check auth status and refresh user data
  async function checkAuth() {
    if (!token.value) return false

    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '1'
        }
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const data = await response.json()
      user.value = data
      return true
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
      return false
    }
  }

  function updateCoins(newAmount: number) {
    if (user.value) {
      user.value.coins = newAmount
    }
  }

  async function login(username: string) {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '1'
        },
        credentials: 'include',
        body: JSON.stringify({ username })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    updateCoins
  }
})