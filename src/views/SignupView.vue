<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { API_URL } from '@/config/api'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isTelegramWebApp = ref(window.Telegram?.WebApp != null)

const username = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')

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
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        referralCode: route.query.ref
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Signup failed')

    // Set authentication
    localStorage.setItem('token', data.token)
    await userStore.$patch({
      user: data.user,
      token: data.token
    })

    // Handle navigation
    if (!isTelegramWebApp.value) {
      await router.push('/')
    }
  } catch (err) {
    console.error('Signup error:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-h5 bg-green pa-4 text-white">
            Sign Up
          </v-card-title>

          <v-card-text class="pa-4">
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
              closable
            >
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleSignup">
              <v-text-field
                v-model="username"
                label="Username"
                required
                :error-messages="error"
                @input="error = ''"
                prepend-icon="mdi-account"
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :error-messages="error"
                @input="error = ''"
                prepend-icon="mdi-email"
              ></v-text-field>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green"
                  @click="handleSignup"
                  :loading="loading"
                  :disabled="!username || !email"
                >
                  Sign Up
                </v-btn>
                <v-btn
                  color="grey"
                  variant="text"
                  @click="router.push('/login')"
                >
                  Already have an account?
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template> 