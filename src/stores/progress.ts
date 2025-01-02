import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const progress = ref(0)
  const maxProgress = 500
  const isRefilling = ref(false)

  function updateProgress(value: number) {
    progress.value = Math.min(value, maxProgress)
  }

  return {
    progress,
    maxProgress,
    isRefilling,
    updateProgress
  }
})
