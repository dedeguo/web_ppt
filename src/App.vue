<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function switchMode() {
  router.push(route.path === '/html' ? '/' : '/html')
}
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <span class="nav-title">Web PPT</span>
      <button class="nav-switch" @click="switchMode">
        {{ route.path === '/html' ? '切换到 JSON 模式' : '切换到 HTML 模式' }}
      </button>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.nav-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.nav-switch {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #3b82f6;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.nav-switch:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}
</style>
