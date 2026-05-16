<script setup>
import { ref, computed } from 'vue'
import { usePptStore } from '../composables/usePptStore'
import { useHtmlApi } from '../composables/useHtmlApi'
import { useDownload } from '../composables/useDownload'

const store = usePptStore()
const { generate } = useHtmlApi()
const { download } = useDownload()
const feedback = ref('')

const hasPpt = computed(() => !!store.pptHtml)
const canSubmit = computed(() => feedback.value.trim().length > 0 && !store.isGenerating)
const buttonText = computed(() => store.isGenerating ? '修改中...' : '发送修改意见')

async function handleSubmit() {
  if (!canSubmit.value) return
  const text = feedback.value
  feedback.value = ''
  await generate(text, true)
}
</script>

<template>
  <div v-if="hasPpt" class="html-controls">
    <div class="controls-bar">
      <span class="control-hint">← → 键翻页 | 点击屏幕翻页</span>
      <button @click="$emit('fullscreen')" title="全屏预览">⛶</button>
      <button @click="download" title="下载 PPT">⬇</button>
    </div>
    <div class="feedback-bar">
      <input
        v-model="feedback"
        type="text"
        placeholder="输入修改意见，如：把标题颜色改成红色，增加动画效果..."
        @keydown.enter="handleSubmit"
      />
      <button :disabled="!canSubmit" @click="handleSubmit">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.html-controls {
  background: #fff;
  border-top: 1px solid #e2e8f0;
}

.controls-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 16px;
}

.control-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-right: auto;
}

.controls-bar button {
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

.controls-bar button:hover {
  background: #f1f5f9;
}

.feedback-bar {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #e2e8f0;
}

.feedback-bar input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

.feedback-bar input:focus {
  border-color: #3b82f6;
}

.feedback-bar button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #10b981;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.feedback-bar button:hover:not(:disabled) {
  background: #059669;
}

.feedback-bar button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>
