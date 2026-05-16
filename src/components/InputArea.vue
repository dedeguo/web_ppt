<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePptStore } from '../composables/usePptStore'
import { useApi } from '../composables/useApi'
import { useHtmlApi } from '../composables/useHtmlApi'
import { usePptRenderer } from '../composables/usePptRenderer'

const route = useRoute()
const store = usePptStore()
const { generate: generateJson } = useApi()
const { generate: generateHtml } = useHtmlApi()
const { render } = usePptRenderer()

const isHtmlMode = computed(() => route.path === '/')

const canGenerate = computed(() => {
  return store.inputText.trim().length >= 10 && !store.isGenerating
})

const buttonText = computed(() => {
  if (store.isGenerating) return '生成中...'
  if (isHtmlMode.value) {
    return store.pptHtml ? '重新生成' : '生成 PPT'
  }
  return store.pptJson ? '重新生成' : '生成 PPT'
})

async function handleGenerate() {
  if (!canGenerate.value) return
  if (isHtmlMode.value) {
    await generateHtml(store.inputText, false)
  } else {
    const json = await generateJson(store.inputText, false)
    if (json) render()
  }
}
</script>

<template>
  <div class="input-area">
    <textarea
      v-model="store.inputText"
      placeholder="请输入 PPT 内容，例如：&#10;&#10;介绍 Python 编程语言的基础知识，包括数据类型、控制流、函数定义、面向对象编程等内容..."
      rows="8"
    ></textarea>
    <button
      class="generate-btn"
      :disabled="!canGenerate"
      @click="handleGenerate"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
.input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

textarea:focus {
  border-color: #3b82f6;
}

.generate-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.generate-btn:hover:not(:disabled) {
  background: #2563eb;
}

.generate-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>
