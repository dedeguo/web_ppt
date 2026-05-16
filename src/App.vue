<script setup>
import { RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const isGuide = computed(() => router.currentRoute.value.name === 'Guide')

function goToGuide() {
  router.push({ name: 'Guide' })
}

function goHome() {
  router.push({ name: 'HtmlMode' })
}
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <span class="nav-title" @click="goHome" style="cursor:pointer">Web PPT</span>
      <div class="nav-actions">
        <button v-if="!isGuide" class="nav-btn" @click="goToGuide" title="使用说明">使用说明</button>
        <button v-else class="nav-btn" @click="goHome" title="返回首页">返回首页</button>
      </div>
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

.nav-actions {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}
</style>