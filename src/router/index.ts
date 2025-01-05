import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './auth-guard'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import BalanceView from '../views/BalanceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/balance',
      name: 'balance',
      component: BalanceView,
      meta: { requiresAuth: true }
    }
    // Add other routes...
  ]
})

// Apply auth guard to all routes
router.beforeEach(authGuard)

export default router
