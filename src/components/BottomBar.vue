<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useProgressStore } from '@/stores/progress';

const userStore = useUserStore();
const progressStore = useProgressStore();
const value = ref(0);

// Compute remaining coins out of 500
const remainingCoins = computed(() => {
  return `${Math.ceil(progressStore.progress)}/500`;
});
</script>

<template>
  <v-container class="d-flex justify-center align-center">
    <v-bottom-navigation
      v-model="value"
      class="bg-green"
      color="green-accent-3"
      active
      rounded="xl"
    >
      <v-btn to="/">
        <v-icon>mdi-play</v-icon>
        Play
      </v-btn>

      <v-btn
      to="/share"
      >
        <v-icon>mdi-account-group</v-icon>

        Friends
      </v-btn>

      <v-btn
      to="/tasks"
      >
        <v-icon>mdi-check-circle</v-icon>

        <span>Tasks</span>
      </v-btn>

      <v-btn
      to="balance"
      >
        <v-icon>mdi-wallet</v-icon>

        Balance
      </v-btn>


    </v-bottom-navigation>
  </v-container>
</template>
<style scoped>
</style>
