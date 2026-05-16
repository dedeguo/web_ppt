import { createRouter, createWebHashHistory } from 'vue-router'

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
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('../views/GuidePage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router