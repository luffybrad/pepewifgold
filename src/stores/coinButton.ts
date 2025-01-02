import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCoinButtonStore = defineStore('coinButton', () => {
  // Constants
  const DEV_MAX_PROGRESS = 20
  const PROD_MAX_PROGRESS = 500
  const maxProgress = import.meta.env.DEV ? DEV_MAX_PROGRESS : PROD_MAX_PROGRESS

  // State
  const progress = ref(Number(localStorage.getItem('coinProgress')) || 0)
  const isRefilling = ref(localStorage.getItem('isRefilling') === 'true')
  const showAlert = ref(isRefilling.value)
  let refillInterval: number | null = null

  // Actions
  function startRefill(remainingTime?: number) {
    if (refillInterval) clearInterval(refillInterval)
    
    const refillTime = remainingTime || 60000 // Use remaining time or default to 1 minute
    const refillStep = maxProgress / (refillTime / 100) // Update every 100ms
    
    if (!remainingTime) {
      localStorage.setItem('refillStartTime', Date.now().toString())
      progress.value = 0
    }

    refillInterval = setInterval(() => {
      if (progress.value < maxProgress) {
        progress.value = Math.min(maxProgress, progress.value + refillStep)
        localStorage.setItem('coinProgress', progress.value.toString())
      } else {
        resetProgress()
      }
    }, 100)
  }

  function resetProgress() {
    if (refillInterval) {
      clearInterval(refillInterval)
      refillInterval = null
    }
    progress.value = 0
    isRefilling.value = false
    localStorage.setItem('isRefilling', 'false')
    localStorage.removeItem('refillStartTime')
    localStorage.setItem('coinProgress', '0')
    showAlert.value = false
  }

  function initializeState() {
    const lastRefillTime = localStorage.getItem('refillStartTime')
    if (lastRefillTime && isRefilling.value) {
      const elapsedTime = Date.now() - Number(lastRefillTime)
      const refillDuration = 60000 // 1 minute in milliseconds
      
      if (elapsedTime < refillDuration) {
        const remainingTime = refillDuration - elapsedTime
        progress.value = maxProgress * (1 - (remainingTime / refillDuration))
        startRefill(remainingTime)
      } else {
        resetProgress()
      }
    }
  }

  function incrementProgress() {
    if (progress.value >= maxProgress || isRefilling.value) return false
    
    progress.value = Math.min(progress.value + 1, maxProgress)
    localStorage.setItem('coinProgress', progress.value.toString())
    
    if (progress.value >= maxProgress) {
      startRefill()
      isRefilling.value = true
      localStorage.setItem('isRefilling', 'true')
      showAlert.value = true
    }
    return true
  }

  function closeAlert() {
    showAlert.value = false
  }

  return {
    progress,
    isRefilling,
    showAlert,
    maxProgress,
    startRefill,
    resetProgress,
    initializeState,
    incrementProgress,
    closeAlert
  }
}) 