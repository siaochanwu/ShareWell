import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/User.vue')
    },
    {
      path: '/travel',
      name: 'travel',
      component: () => import('../views/Travel.vue'),
    },
    {
      path: '/travel/:id',
      name: 'payment',
      component: () => import('../views/Payment.vue')
    }
  ]
})

export default router
