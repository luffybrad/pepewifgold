import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCoinButtonStore = defineStore('coinButton', () => {
  const maxProgress = 500
  const progress = ref(Number(localStorage.getItem('coinProgress')) || 0)
  const isRefilling = ref(localStorage.getItem('isRefilling') === 'true')
  const showAlert = ref(isRefilling.value)

  function incrementProgress(): boolean {
    if (progress.value >= maxProgress || isRefilling.value) {
      return false
    }
    
    progress.value++
    localStorage.setItem('coinProgress', progress.value.toString())
    
    if (progress.value >= maxProgress) {
      startRefill()
      isRefilling.value = true
      localStorage.setItem('isRefilling', 'true')
      showAlert.value = true
    }
    return true
  }

  function startRefill() {
    progress.value = 0
    setTimeout(() => {
      isRefilling.value = false
      localStorage.setItem('isRefilling', 'false')
      showAlert.value = false
    }, 60000) // 1 minute cooldown
  }

  function closeAlert() {
    showAlert.value = false
  }

  function initializeState() {
    const lastRefillTime = localStorage.getItem('refillStartTime')
    if (lastRefillTime && isRefilling.value) {
      const elapsedTime = Date.now() - Number(lastRefillTime)
      if (elapsedTime < 60000) {
        setTimeout(() => {
          isRefilling.value = false
          localStorage.setItem('isRefilling', 'false')
          showAlert.value = false
        }, 60000 - elapsedTime)
      } else {
        isRefilling.value = false
        localStorage.setItem('isRefilling', 'false')
        showAlert.value = false
      }
    }
  }

  return {
    progress,
    maxProgress,
    isRefilling,
    showAlert,
    incrementProgress,
    closeAlert,
    initializeState
  }
}) 