import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShareView from '@/views/ShareView.vue'
import TasksView from '@/views/TasksView.vue'
import BalanceView from '@/views/BalanceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: HomeView,
      props: route => ({ referralCode: route.query.ref })
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/share',
      name: 'share',
      component: ShareView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView
    },
    {
      path: '/balance',
      name: 'balance',
      component: BalanceView
    }
  ],
})

export default router
