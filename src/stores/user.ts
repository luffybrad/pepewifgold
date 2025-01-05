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

  const isAuthenticated = computed(() => !!token.value)

  function updateCoins(newAmount: number) {
    if (user.value) {
      user.value.coins = newAmount
    }
  }

  async function login(username: string) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '1'
        },
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
    isAuthenticated,
    login,
    logout,
    updateCoins
  }
})