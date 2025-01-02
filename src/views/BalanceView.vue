<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <!-- Loading State -->
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          class="ma-4"
        ></v-progress-circular>

        <!-- Error State -->
        <v-alert
          v-if="error"
          type="error"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <!-- Balance Card -->
        <v-card class="mb-4">
          <v-card-title class="text-center">
            Your Balance
          </v-card-title>
          <v-card-text class="text-center text-h4">
            {{ userStore.user?.coins || 0 }} Coins
          </v-card-text>
        </v-card>

        <!-- Transactions List -->
        <v-card>
          <v-card-title>
            Transaction History
          </v-card-title>
          <v-card-text>
            <v-list v-if="transactions.length > 0">
              <v-list-item
                v-for="(transaction, index) in transactions"
                :key="index"
                :title="transaction.type"
                :subtitle="new Date(transaction.date).toLocaleDateString()"
              >
                <template v-slot:append>
                  <span :class="transaction.amount >= 0 ? 'text-success' : 'text-error'">
                    {{ transaction.amount >= 0 ? '+' : '' }}{{ transaction.amount }}
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

interface Transaction {
  type: string
  amount: number
  date: string
}

const userStore = useUserStore()
const router = useRouter()

const transactions = ref<Transaction[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/')
    return
  }

  try {
    loading.value = true
    // Initialize with empty array until API is ready
    transactions.value = [
      {
        type: 'Initial Balance',
        amount: userStore.user?.coins || 0,
        date: new Date().toISOString()
      }
    ]
    loading.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    loading.value = false
  }
})
</script>

<style scoped>
.text-success {
  color: green !important;
}

.text-error {
  color: red !important;
}
</style>
