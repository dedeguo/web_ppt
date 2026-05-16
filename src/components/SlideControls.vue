<script setup>
import { computed } from 'vue'
import { usePptStore } from '../composables/usePptStore'
import { useDownload } from '../composables/useDownload'

const store = usePptStore()
const { download } = useDownload()

const hasPpt = computed(() => !!store.pptHtml)
</script>

<template>
  <div v-if="hasPpt" class="slide-controls">
    <span class="control-hint">← → 键翻页 | 点击屏幕翻页</span>
    <button @click="$emit('fullscreen')" title="全屏预览">⛶</button>
    <button @click="download" title="下载 PPT">⬇</button>
  </div>
</template>

<style scoped>
.slide-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid #e2e8f0;
}

.control-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-right: auto;
}

button {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

button:hover {
  background: #f1f5f9;
}
</style>