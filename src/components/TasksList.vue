<template>
  <v-container>
    <span class="d-flex justify-center text-green text-h4">
      Earn More Coins
    </span>
    <v-divider class="my-5" thickness="1" color="success" opacity="10">
    </v-divider>

    <v-list>
      <v-list-item
        v-for="task in tasks"
        :key="task.link"
        :prepend-icon="task.icon"
        :class="task.class"
        variant="tonal"
        rounded="xl"
        append-icon="mdi-chevron-right"
        :href="task.link"
        target="_blank"
        @click.prevent="handleSubscribe(task.link, task.type)"
      >
        <v-list-item-title>
          {{ task.title }}
        </v-list-item-title>
        <v-list-item-subtitle>
          2500
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { API_URL } from '@/config/api'

const userStore = useUserStore()

const tasks = ref([
  {
    icon: 'mdi-youtube',
    class: 'text-red red my-5',
    link: 'https://www.youtube.com/@LuffysDrip?sub_confirmation=1',
    title: 'Subscribe',
    type: 'youtube_subscribe'
  },
  {
    icon: 'mdi-twitter',
    class: 'text-black black my-5',
    link: 'https://twitter.com/LuffysDrip',
    title: 'Follow Us',
    type: 'twitter_follow'
  },
  {
    icon: 'mdi-facebook',
    class: 'text-blue-darken-4 blue-darken-4 my-5',
    link: 'https://www.facebook.com/LuffysDrip',
    title: 'Follow Us',
    type: 'facebook_follow'
  },
  {
    icon: 'mdi-instagram',
    class: 'text-pink-accent-3 pink-accent-3 my-5',
    link: 'https://www.instagram.com/LuffysDrip',
    title: 'Follow Us',
    type: 'instagram_follow'
  },
  {
    icon: 'mdi-send',
    class: 'text-light-blue light-blue my-5',
    link: 'https://t.me/LuffysDrip',
    title: 'Follow Us',
    type: 'telegram_follow'
  }
])

async function handleSubscribe(link: string, type: string) {
  try {
    const response = await fetch(`${API_URL}/add-coins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`,
        'ngrok-skip-browser-warning': '1'
      },
      credentials: 'include',
      body: JSON.stringify({
        amount: 2500,
        taskType: type
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add coins');
    }

    const data = await response.json();
    userStore.updateCoins(data.coins);
    window.open(link, '_blank');
  } catch (error) {
    console.error('Failed to add coins:', error)
  }
}
</script>

<style scoped>
</style>
