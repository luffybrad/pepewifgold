<script setup lang="ts">
import BottomBar from './components/BottomBar.vue';
import TopBar from './components/TopBar.vue';
</script>

<template>
  <v-layout class="fill-height">
    <v-app>
      <TopBar />
      <v-main class="d-flex align-center">
        <v-container fluid>
          <RouterView />
        </v-container>
      </v-main>
      <BottomBar />
    </v-app>
  </v-layout>
</template>

<style>
</style>
