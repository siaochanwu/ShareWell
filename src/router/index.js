import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
      component: () => import('../views/404.vue')
    },
    {
      path: '/',
      name: 'user',
      component: () => import('../views/User.vue')
    },
    {
      path: '/user/:id',
      name: 'singleuser',
      component: () => import('../views/SingleUser.vue')
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('../views/Project.vue')
    },
    {
      path: '/project/:id',
      name: 'Item',
      component: () => import('../views/Item.vue')
    }
  ]
})

export default router
