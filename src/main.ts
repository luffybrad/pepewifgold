import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader


const app = createApp(App)
const pinia = createPinia()

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

app.use(pinia)
app.use(router)
app.use(vuetify)

// Initialize authentication
const userStore = useUserStore()
await userStore.initializeAuth()

app.mount('#app')
