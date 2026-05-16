<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SidePanel from '../components/SidePanel.vue'
import PreviewPanel from '../components/PreviewPanel.vue'

const isFullscreen = ref(false)

function enterFullscreen() {
  const el = document.documentElement
  if (el.requestFullscreen) el.requestFullscreen()
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  else if (el.msRequestFullscreen) el.msRequestFullscreen()
}

function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen()
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  else if (document.msExitFullscreen) document.msExitFullscreen()
}

function toggleFullscreen() {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div class="json-mode-container" :class="{ fullscreen: isFullscreen }">
    <aside class="side-panel">
      <SidePanel />
    </aside>
    <main class="preview-panel">
      <PreviewPanel @fullscreen="toggleFullscreen" />
    </main>
  </div>
</template>

<style scoped>
.json-mode-container {
  display: flex;
  height: 100vh;
}

.json-mode-container.fullscreen .side-panel {
  display: none;
}

.json-mode-container.fullscreen .preview-panel {
  width: 100%;
}

.json-mode-container.fullscreen .slide-controls,
.json-mode-container.fullscreen .feedback-bar {
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