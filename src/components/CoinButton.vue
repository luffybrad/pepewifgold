<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useCoinButtonStore } from '@/stores/coinButton'
import { ref, onMounted } from 'vue'
import { API_URL } from '@/config/api'
import logo from '@/assets/images/pepewifgold.jpg'

const userStore = useUserStore()
const coinButtonStore = useCoinButtonStore()

interface FloatingCoin {
  id: number
  x: number
  y: number
}

const floatingCoins = ref<FloatingCoin[]>([])
let nextCoinId = 0

function addFloatingCoin(x: number, y: number) {
  const coin = {
    id: nextCoinId++,
    x,
    y
  }
  floatingCoins.value.push(coin)
  setTimeout(() => {
    floatingCoins.value = floatingCoins.value.filter(c => c.id !== coin.id)
  }, 1000)
}

async function handleClick(event: MouseEvent) {
  if (!coinButtonStore.incrementProgress()) return
  
  try {
    addFloatingCoin(event.clientX, event.clientY)
    
    const response = await fetch(`${API_URL}/add-coins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`,
        'ngrok-skip-browser-warning': '1'
      },
      credentials: 'include',
      body: JSON.stringify({
        amount: 1,
        taskType: 'click_coin'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add coins');
    }

    const data = await response.json();
    userStore.updateCoins(data.coins);
  } catch (error) {
    console.error('Failed to add coins:', error)
  }
}

onMounted(() => {
  coinButtonStore.initializeState()
})
</script>

<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <div class="coin-container">
      <!-- Alert Banner -->
      <v-banner
        v-if="coinButtonStore.showAlert && coinButtonStore.isRefilling"
        color="error"
        class="alert-position"
        rounded="lg"
        elevation="2"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-clock-outline" start></v-icon>
        </template>
        
        <div class="d-flex align-center justify-space-between w-100">
          <span>Please wait 1 minute to continue playing</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="coinButtonStore.closeAlert"
          ></v-btn>
        </div>
      </v-banner>

      <!-- Coin button -->
      <v-btn
        size="300"
        rounded="xl"
        flat
        class="coin-button mt-16"
        :disabled="!userStore.isAuthenticated || coinButtonStore.progress >= coinButtonStore.maxProgress || coinButtonStore.isRefilling"
        @click="handleClick"
      >
        <v-avatar size="250">
          <v-img :src="logo" cover></v-img>
        </v-avatar>
      </v-btn>

      <!-- Floating coins animations -->
      <transition-group name="coin-float">
        <div
          v-for="coin in floatingCoins"
          :key="coin.id"
          class="floating-coin"
          :style="{
            left: `${coin.x}px`,
            top: `${coin.y}px`
          }"
        >
          <v-avatar size="50">
            <v-img :src="logo" cover></v-img>
          </v-avatar>
        </div>
      </transition-group>

      <!-- Progress bar -->
      <v-progress-linear
        class="progress-position"
        :model-value="coinButtonStore.progress"
        :max="coinButtonStore.maxProgress"
        height="20"
        :color="coinButtonStore.isRefilling ? 'grey' : 'green-accent-3'"
        rounded
        striped
      >
        <template v-slot:default="{ value }">
          <strong class="text-green">{{ Math.ceil(coinButtonStore.progress) }}/{{ coinButtonStore.maxProgress }}</strong>
        </template>
      </v-progress-linear>
    </div>
  </v-container>
</template>

<style scoped>
.coin-container {
  position: relative;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.alert-position {
  position: absolute;
  top: -60px;
  width: 100%;
  z-index: 100;
}

.progress-position {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.floating-coin {
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
}

.coin-float-enter-active {
  animation: float-up 0.5s ease-out forwards;
}

.coin-float-leave-active {
  animation: fade-out 0.2s ease-out forwards;
}

@keyframes float-up {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -150%) scale(1);
    opacity: 0;
  }
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}
</style>
