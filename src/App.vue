<script setup lang="ts">
import BottomBar from './components/BottomBar.vue';
import TopBar from './components/TopBar.vue';
import HomeView from './views/HomeView.vue';

</script>

<template>

<v-layout>
  <v-container fluid
  >
  <TopBar/>
  <HomeView/>
  <BottomBar/>
</v-container>
</v-layout>



</template>


<style>
</style>
