<template>
  <v-container>
    <span class="d-flex justify-center text-green text-h4">
      Your Activity
    </span>
    <v-divider class="my-5" thickness="1" color="success" opacity="10" />

    <!-- Referrals Section -->
    <v-card class="mb-4">
      <v-card-title class="bg-green text-white">
        Successful Referrals
      </v-card-title>
      <v-card-text>
        <v-list v-if="stats.referrals.length">
          <v-list-item
            v-for="referral in stats.referrals"
            :key="referral.created_at"
          >
            <v-list-item-title>
              {{ referral.referred_user }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Joined {{ new Date(referral.created_at).toLocaleDateString() }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-chip color="green" text="500">
                +500 coins
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
        <v-alert
          v-else
          type="info"
          text="No referrals yet. Share your referral link to earn coins!"
        />
      </v-card-text>
    </v-card>

    <!-- Tasks Section -->
    <v-card>
      <v-card-title class="bg-green text-white">
        Completed Tasks
      </v-card-title>
      <v-card-text>
        <v-list v-if="stats.tasks.length">
          <v-list-item
            v-for="task in stats.tasks"
            :key="task.completed_at"
          >
            <v-list-item-title>
              {{ formatTaskType(task.task_type) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Completed {{ new Date(task.completed_at).toLocaleDateString() }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-chip color="green" :text="task.coins_earned.toString()">
                +{{ task.coins_earned }} coins
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
        <v-alert
          v-else
          type="info"
          text="No tasks completed yet. Visit the Tasks page to earn coins!"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

interface Referral {
  referred_user: string;
  created_at: string;
}

interface Task {
  task_type: string;
  coins_earned: number;
  completed_at: string;
}

interface Stats {
  referrals: Referral[];
  tasks: Task[];
}

const stats = ref<Stats>({
  referrals: [],
  tasks: []
})

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5000/user/stats', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    const data = await response.json()
    stats.value = data
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
})

function formatTaskType(type: string) {
  return type.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
</script>

<style scoped>
</style>
