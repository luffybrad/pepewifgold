<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useCoinButtonStore } from '@/stores/coinButton'
import { ref, onMounted, onUnmounted } from 'vue'
import logo from '@/assets/images/pepewifgold.jpg'

const userStore = useUserStore()
const coinButtonStore = useCoinButtonStore()

// Array to store multiple coin animations
const floatingCoins = ref<Array<{ id: number, x: number, y: number }>>([])
let coinCounter = 0

onMounted(() => {
  coinButtonStore.initializeState()
})

async function handleCoinClick(event: MouseEvent) {
  try {
    if (!userStore.isAuthenticated) return

    const canIncrement = coinButtonStore.incrementProgress()
    if (!canIncrement) return

    await userStore.addCoins(1, 'click_coin')
    
    const newCoin = {
      id: coinCounter++,
      x: event.clientX,
      y: event.clientY
    }
    
    floatingCoins.value.push(newCoin)
    
    setTimeout(() => {
      floatingCoins.value = floatingCoins.value.filter(coin => coin.id !== newCoin.id)
    }, 1000)
  } catch (error) {
    console.error('Failed to add coin:', error)
  }
}
</script>

<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <div class="coin-container">
      <!-- Updated Alert Banner -->
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
        @click="handleCoinClick"
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
  animation: float-up 1s ease-out forwards;
}

.coin-float-leave-active {
  animation: fade-out 0.3s ease-out forwards;
}

@keyframes float-up {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -200%) scale(1);
    opacity: 0;
  }
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}
</style>
