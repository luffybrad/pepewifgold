<script setup lang="ts">
import { API_URL } from '@/config/api'
import logo from '@/assets/images/pepewifgold.jpg'
import { useUserStore } from '@/stores/user'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const loginDialog = ref(false)
const signupDialog = ref(false)
const username = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const referralCode = ref(route.query.ref as string || '')
const isTelegramWebApp = ref(window.Telegram?.WebApp != null)

// Watch for route changes to handle referral links
watch(
  () => route.query.ref,
  (newRef) => {
    if (newRef) {
      referralCode.value = newRef as string
      signupDialog.value = true
    }
  }
)

onMounted(async () => {
  await userStore.initializeUserState()
})

async function handleLogin() {
  if (!username.value) {
    error.value = 'Username is required'
    return
  }

  try {
    loading.value = true
    error.value = ''
    await userStore.login(username.value)
    loginDialog.value = false
    resetForm()
    
    // Don't redirect if in Telegram WebApp
    if (!isTelegramWebApp.value && route.path !== '/') {
      await router.push('/')
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleSignup() {
  if (!username.value || !email.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        referralCode: route.query.ref
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed')
    }

    // Store token first
    localStorage.setItem('token', data.token)
    
    // Update user store
    await userStore.$patch({
      user: data.user,
      token: data.token
    })

    // Reset form and close dialog
    username.value = ''
    email.value = ''
    error.value = ''
    signupDialog.value = false

    // Show success message
    snackbarText.value = 'Welcome to PepeWifGold!'
    snackbar.value = true

    // Ensure we're authenticated before redirecting
    if (userStore.isAuthenticated) {
      await router.push({ path: '/' })
    }
  } catch (err) {
    console.error('Signup error:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  username.value = ''
  email.value = ''
  error.value = ''
}

function switchToSignup() {
  loginDialog.value = false
  signupDialog.value = true
  resetForm()
}

function switchToLogin() {
  signupDialog.value = false
  loginDialog.value = true
  resetForm()
}

// Add proper logout handling
async function handleLogout() {
  try {
    await userStore.logout()
    // Only redirect if not in Telegram WebApp and not on home page
    if (!isTelegramWebApp.value && route.path !== '/') {
      await router.push('/')
    }
  } catch (err) {
    console.error('Logout error:', err)
    snackbarText.value = 'Logout failed'
    snackbar.value = true
  }
}
</script>

<template>
  <v-container class="d-flex justify-center align-center">
    <v-banner sticky lines="one" class="bg-green" :avatar="logo" rounded="xl">
      <v-banner-text>
        {{ userStore.user?.username || 'Guest' }}
      </v-banner-text>
      <v-banner-text class="d-flex align-center">
        {{ userStore.user ? `Coins: ${userStore.user.coins}` : '' }}
      </v-banner-text>

      <template v-slot:actions>
        <!-- Login Dialog -->
        <v-dialog v-model="loginDialog" max-width="400" persistent v-if="!userStore.isAuthenticated">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="white" icon="mdi-login" rounded />
          </template>

          <v-card>
            <v-card-title class="text-h5 bg-green pa-4 text-white">
              Login
            </v-card-title>

            <v-card-text class="pt-4">
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="username"
                  label="Username"
                  required
                  :error-messages="error"
                  @input="error = ''"
                />
              </v-form>
              <div class="text-center mt-2">
                <v-btn
                  variant="text"
                  color="green"
                  @click="switchToSignup"
                  :disabled="loading"
                >
                  Not a user? Sign up
                </v-btn>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="grey" 
                variant="text" 
                @click="loginDialog = false"
                :disabled="loading"
              >
                Cancel
              </v-btn>
              <v-btn
                color="green"
                @click="handleLogin"
                :loading="loading"
                :disabled="!username"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Signup Dialog -->
        <v-dialog v-model="signupDialog" max-width="400" persistent>
          <v-card>
            <v-card-title class="text-h5 bg-green pa-4 text-white">
              Sign Up
            </v-card-title>

            <v-card-text class="pt-4">
              <v-form @submit.prevent="handleSignup">
                <v-text-field
                  v-model="username"
                  label="Username"
                  required
                  :error-messages="error"
                  @input="error = ''"
                />
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  required
                  :error-messages="error"
                  @input="error = ''"
                />
                <v-text-field
                  v-if="referralCode"
                  v-model="referralCode"
                  label="Referral Code"
                  readonly
                  disabled
                />
              </v-form>
              <div class="text-center mt-2">
                <v-btn
                  variant="text"
                  color="green"
                  @click="switchToLogin"
                  :disabled="loading"
                >
                  Already have an account? Login
                </v-btn>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="grey" 
                variant="text" 
                @click="signupDialog = false"
                :disabled="loading"
              >
                Cancel
              </v-btn>
              <v-btn
                color="green"
                @click="handleSignup"
                :loading="loading"
                :disabled="!username || !email"
              >
                Sign Up
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Logout Button -->
        <v-btn
          v-if="userStore.isAuthenticated"
          color="red"
          icon="mdi-logout"
          rounded
          @click="handleLogout"
        />
      </template>
    </v-banner>
  </v-container>
</template>

<style scoped>
</style>
