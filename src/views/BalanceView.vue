<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
        </div>

        <!-- Error State -->
        <v-alert
          v-else-if="error"
          type="error"
          class="mb-4"
          closable
        >
          {{ error }}
        </v-alert>

        <template v-else>
          <!-- Balance Card -->
          <v-card class="mb-4">
            <v-card-title class="text-center">
              Your Balance
            </v-card-title>
            <v-card-text class="text-center text-h4">
              {{ userStore.user?.coins || 0 }} Coins
            </v-card-text>
          </v-card>

          <!-- Referrals List -->
          <v-card class="mb-4" v-if="referrals.length > 0">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-account-multiple" class="mr-2"></v-icon>
              Referral Achievements
            </v-card-title>
            
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(referral, index) in referrals"
                  :key="index"
                  :title="`Referred ${referral.referred_user}`"
                  :subtitle="new Date(referral.created_at).toLocaleDateString()"
                >
                  <template v-slot:append>
                    <span class="text-success">
                      +500
                    </span>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Transactions List -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-history" class="mr-2"></v-icon>
              Transaction History
            </v-card-title>
            
            <v-card-text>
              <v-list v-if="transactions.length > 0">
                <v-list-item
                  v-for="transaction in transactions"
                  :key="transaction.id"
                  :title="transaction.task_type"
                  :subtitle="new Date(transaction.completed_at).toLocaleDateString()"
                >
                  <template v-slot:append>
                    <span class="text-success">
                      +{{ transaction.coins_earned }}
                    </span>
                  </template>
                </v-list-item>
              </v-list>
              
              <v-alert
                v-else
                type="info"
                variant="tonal"
                class="mt-2"
              >
                No transactions to display
              </v-alert>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { API_URL } from '@/config/api'

interface Transaction {
  id: number
  task_type: string
  coins_earned: number
  completed_at: string
}

interface Referral {
  referred_user: string
  created_at: string
  coins_earned: number
}

const userStore = useUserStore()
const router = useRouter()
const transactions = ref<Transaction[]>([])
const referrals = ref<Referral[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchUserStats() {
  if (!userStore.token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(`${API_URL}/user/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userStore.token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch user stats')
  }

  return await response.json()
}

onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/')
    return
  }

  try {
    loading.value = true
    const stats = await fetchUserStats()
    transactions.value = stats.tasks || []
    referrals.value = stats.referrals || []
  } catch (err) {
    console.error('Error fetching stats:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.text-success {
  color: rgb(0, 128, 0) !important;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
