import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest } from './auth-guard'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ShareView from '@/views/ShareView.vue'
import BalanceView from '@/views/BalanceView.vue'
import TasksView from '@/views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: requireAuth
    },
    {
      path: '/share',
      name: 'share',
      component: ShareView,
      beforeEnter: requireAuth
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      beforeEnter: requireAuth
    },
    {
      path: '/balance',
      name: 'balance',
      component: BalanceView,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: requireGuest
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      beforeEnter: requireGuest
    }
  ]
})

export default router
