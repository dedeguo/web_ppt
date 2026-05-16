<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <span class="nav-title">Web PPT</span>
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
</style>
