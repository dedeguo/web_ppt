import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HtmlMode',
    component: () => import('../views/HtmlMode.vue'),
  },
  {
    path: '/json',
    name: 'JsonMode',
    component: () => import('../views/JsonMode.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
