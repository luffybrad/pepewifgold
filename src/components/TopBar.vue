<script setup lang="ts">
import logo from '@/assets/images/pepewifgold.jpg'

</script>
<template>
  <v-container
  class="d-flex justify-center align-center"
  >
  <v-banner
    sticky
    lines="one"
    class="bg-green"
    :avatar="logo"
    rounded="xl"
    >
  <v-banner-text>
    Luffy
  </v-banner-text>
  <v-banner-text>
    Rank A
  </v-banner-text>

      <template v-slot:actions>
        <v-btn
        color="red"
        icon="mdi-logout"
        rounded
        >

        </v-btn>
      </template>
    </v-banner>

  </v-container>
</template>
<style scoped>
</style>
