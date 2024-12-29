<script setup lang="ts">
import BottomBar from './components/BottomBar.vue';
import TopBar from './components/TopBar.vue';
</script>

<template>

<v-layout>
  <v-container fluid
  >
  <TopBar/>
  <RouterView/>
  <BottomBar/>
</v-container>
</v-layout>



</template>


<style>
</style>
