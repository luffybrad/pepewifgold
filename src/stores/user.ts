import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_URL } from '@/config/api'

interface User {
  id: number
  username: string
  email: string
  coins: number
  isLoggedIn: boolean
}

interface ApiResponse {
  token?: string
  error?: string
  coins?: number
  userId?: number
  username?: string
  email?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)
  const lastClickTime = ref<number>(0)

  async function login(username: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username }),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      if (data.token) {
        token.value = data.token
        localStorage.setItem('token', data.token)
        await initializeUserState()
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function initializeUserState(): Promise<void> {
    try {
      if (!token.value) return

      const response = await fetch(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData: ApiResponse = await response.json()

      if (userData.userId && userData.username && userData.email !== undefined) {
        user.value = {
          id: userData.userId,
          username: userData.username,
          email: userData.email,
          coins: userData.coins || 0,
          isLoggedIn: true
        }
      }
    } catch (error) {
      console.error('Error initializing user state:', error)
      logout()
    }
  }

  async function addCoins(amount: number, taskType: string) {
    if (!token.value || !user.value) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch(`${API_URL}/add-coins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: 1,
          taskType: 'click_coin'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        throw new Error(errorData.error || 'Failed to add coins')
      }

      const data = await response.json()
      
      if (user.value && typeof data.coins === 'number') {
        user.value.coins = data.coins
      }
      return data
    } catch (error) {
      console.error('Add coins error:', error)
      throw error
    }
  }

  async function signup(username: string, email: string, referralCode?: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, referralCode }),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      return data
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async function logout() {
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
    initializeUserState,
    addCoins,
    signup
  }
})