<script setup lang="ts">
import logo from '@/assets/images/pepewifgold.jpg'


</script>
<template>
  <v-container>
    <v-card
    color="green"
    variant="tonal"
    class="text-center"
    >
        <v-card-title
        >
          <v-avatar
          size="x-small"
          >
          <v-img
          :src="logo"
          ></v-img>
        </v-avatar>
          500
        </v-card-title>

        <v-card-text>
          <v-btn
          size="300"
          rounded
          flat
          >
          <v-avatar
          size="250"
          >
        <v-img
        :src="logo"
        cover
        ></v-img>
        </v-avatar>
      </v-btn>
        </v-card-text>
      </v-card>
  </v-container>
</template>
<style scoped>
</style>
