import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'JsonMode',
    component: () => import('../views/JsonMode.vue'),
  },
  {
    path: '/html',
    name: 'HtmlMode',
    component: () => import('../views/HtmlMode.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
