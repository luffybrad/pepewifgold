<script setup lang="ts">
import { ref } from 'vue';



const value = ref(0)

</script>
<template>
  <v-container
  class="d-flex justify-center align-center"
  >
    <v-bottom-navigation
      v-model="value"
      color="green-accent-3"
      active
      rounded="xl"
    >
    <v-sheet
    class="d-flex justify-center align-center bg-green"
    rounded="xl"
    width="50%"
    >

      <v-btn
      to="/"
      >
        <v-icon>mdi-cash</v-icon>

        500/500
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



    </v-sheet>


    </v-bottom-navigation>
  </v-container>
</template>
<style scoped>
</style>
