<script setup>
import SidePanel from './components/SidePanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'
</script>

<template>
  <div class="app-container">
    <aside class="side-panel">
      <SidePanel />
    </aside>
    <main class="preview-panel">
      <PreviewPanel />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.side-panel {
  width: 380px;
  min-width: 380px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}
</style>