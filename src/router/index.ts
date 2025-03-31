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
      path: '/start',
      name: 'start',
      component: () => import('../views/StartView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/take-picture',
      name: 'take-picture',
      component: () => import('../views/TakePictureView.vue')
    },
    {
      path: '/view-picture/:imageName',
      name: 'view-picture',
      component: () => import('../views/ViewPictureView.vue')
    }
  ]
})

export default router
