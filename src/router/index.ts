import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShareView from '@/views/ShareView.vue'
import TasksView from '@/views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    }
  ],
})

export default router
