<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const isTelegramWebApp = ref(window.Telegram?.WebApp != null)

const username = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!username.value) {
    error.value = 'Username is required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await userStore.login(username.value)
    
    // Handle navigation
    if (!isTelegramWebApp.value) {
      await router.push('/')
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed'
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
            Login
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

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Username"
                required
                :error-messages="error"
                @input="error = ''"
                prepend-icon="mdi-account"
              ></v-text-field>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green"
                  @click="handleLogin"
                  :loading="loading"
                  :disabled="!username"
                >
                  Login
                </v-btn>
                <v-btn
                  color="grey"
                  variant="text"
                  @click="router.push('/signup')"
                >
                  Need an account?
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template> 