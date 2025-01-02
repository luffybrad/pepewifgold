import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: number;
  username: string;
  email: string;
  coins: number;
  lastLogin?: Date;
  isLoggedIn: boolean;
}

interface SignupData {
  username: string;
  email: string;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(false)
  const router = useRouter()

  async function initializeUserState() {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      return
    }

    try {
      // Fetch user data using the stored token
      const response = await fetch('http://localhost:5000/user', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()
      user.value = {
        id: userData.userId,
        username: userData.username,
        email: userData.email,
        coins: userData.coins,
        isLoggedIn: true
      }
      token.value = storedToken
      isAuthenticated.value = true
    } catch (error) {
      console.error('Error initializing user state:', error)
      // Clear invalid token
      localStorage.removeItem('token')
      token.value = null
      user.value = null
      isAuthenticated.value = false
    }
  }

  // Login user
  async function login(username: string) {
    try {
      const response = await fetch('http://localhost:5000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error('Username is required');
          case 404:
            throw new Error('User not found. Please check your username or sign up.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(data.error || 'Login failed. Please try again.');
        }
      }

      user.value = {
        id: data.userId,
        username: data.username,
        email: data.email,
        coins: data.coins,
        isLoggedIn: true
      };
      token.value = data.token;
      isAuthenticated.value = true;
      localStorage.setItem('token', data.token);

      await router.push('/');
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async function logout() {
    try {
      if (token.value) {
        await fetch('http://localhost:5000/signout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
    }
  }

  async function signup(username: string, email: string, referralCode?: string) {
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          referralCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            if (data.error === 'Username already exists') {
              throw new Error('This username is already taken. Please choose another one.');
            }
            throw new Error('Invalid input. Please check your details.');
          case 401:
            throw new Error('Authentication failed. Please try again.');
          case 404:
            throw new Error('Username not found. Please check and try again.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(data.error || 'Signup failed. Please try again.');
        }
      }

      // Store user data and token
      user.value = {
        id: data.userId,
        username: data.username,
        email: data.email,
        coins: data.coins,
        isLoggedIn: true
      };
      token.value = data.token;
      isAuthenticated.value = true;
      localStorage.setItem('token', data.token);

      // Redirect to home page after successful signup
      await router.push('/')
      
      return data;
    } catch (error) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  }

  // Add coin functionality
  async function addCoin() {
    try {
      const response = await fetch('http://localhost:5000/add-coin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add coin');
      }

      const data = await response.json();
      if (user.value) {
        user.value.coins = data.coins;
      }
    } catch (error) {
      console.error('Error adding coin:', error);
      throw error;
    }
  }

  async function addCoins(amount: number, taskType: string) {
    if (!token.value) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch('http://localhost:5000/add-coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify({ amount, taskType })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add coins');
      }

      const data = await response.json();
      if (user.value) {
        user.value.coins = data.coins;
      }
      return data;
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  }

  return { 
    user, 
    token, 
    isAuthenticated, 
    initializeUserState, 
    login, 
    logout,
    signup,
    addCoin,
    addCoins
  }
})