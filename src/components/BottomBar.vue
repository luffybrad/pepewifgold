<script setup lang="ts">
import { ref } from 'vue';



const value = ref(0)

</script>
<template>
  <v-container>
    <v-bottom-navigation
      v-model="value"
      color="success"
      active
    >
      <v-btn>
        <v-icon>mdi-history</v-icon>

        500/500
      </v-btn>

      <v-btn>
        <v-icon>mdi-account-group</v-icon>

        Friends
      </v-btn>

      <v-btn>
        <v-icon>mdi-check-circle</v-icon>

        <span>Tasks</span>
      </v-btn>

      <v-btn>
        <v-icon>mdi-wallet</v-icon>

        Balance
      </v-btn>

    </v-bottom-navigation>
  </v-container>
</template>
<style scoped>
</style>
