<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SidePanel from '../components/SidePanel.vue'
import HtmlPreview from '../components/HtmlPreview.vue'
import HtmlControls from '../components/HtmlControls.vue'

const isFullscreen = ref(false)

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="html-mode-container" :class="{ fullscreen: isFullscreen }">
    <aside class="side-panel">
      <SidePanel />
    </aside>
    <main class="preview-panel">
      <HtmlPreview />
      <HtmlControls @fullscreen="toggleFullscreen" />
    </main>
  </div>
</template>

<style scoped>
.html-mode-container {
  display: flex;
  height: 100vh;
}

.html-mode-container.fullscreen .side-panel {
  display: none;
}

.html-mode-container.fullscreen .preview-panel {
  width: 100%;
}

.html-mode-container.fullscreen .html-controls {
  display: none;
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