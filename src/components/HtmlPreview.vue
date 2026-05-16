<script setup>
import { ref, watch, computed } from 'vue'
import { usePptStore } from '../composables/usePptStore'

const store = usePptStore()
const iframeRef = ref(null)

const hasContent = computed(() => !!store.pptHtml)

watch(() => store.pptHtml, (html) => {
  if (!html || !iframeRef.value) return
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  iframeRef.value.src = url
})
</script>

<template>
  <div class="html-preview-container">
    <div v-if="store.isGenerating" class="loading-state">
      <div class="skeleton">
        <div class="sk-line w-60"></div>
        <div class="sk-line w-80"></div>
        <div class="sk-line w-70"></div>
        <div class="sk-line w-50"></div>
      </div>
      <p>AI 正在生成 PPT HTML...</p>
    </div>
    <div v-else-if="store.error" class="error-state">
      <p class="error-icon">⚠️</p>
      <p>{{ store.error }}</p>
    </div>
    <div v-else-if="!hasContent" class="empty-state">
      <p class="empty-icon">📄</p>
      <p>在左侧输入内容，点击生成 PPT</p>
    </div>
    <iframe
      ref="iframeRef"
      class="html-iframe"
      :class="{ visible: hasContent && !store.isGenerating && !store.error }"
      sandbox="allow-scripts"
      title="PPT Preview"
    ></iframe>
  </div>
</template>

<style scoped>
.html-preview-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.html-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.html-iframe.visible {
  opacity: 1;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  color: #94a3b8;
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.sk-line {
  height: 14px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.w-60 { width: 300px; }
.w-80 { width: 400px; }
.w-70 { width: 350px; }
.w-50 { width: 250px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-icon { font-size: 32px; margin-bottom: 8px; }
.empty-icon { font-size: 40px; margin-bottom: 8px; }

.loading-state p, .error-state p { font-size: 15px; }
.empty-state p { font-size: 15px; }
.error-state p { color: #ef4444; }
</style>
