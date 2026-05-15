<script setup>
import { ref, computed } from 'vue'
import { usePptStore } from '../composables/usePptStore'
import { useApi } from '../composables/useApi'
import { usePptRenderer } from '../composables/usePptRenderer'

const store = usePptStore()
const { generate } = useApi()
const { render } = usePptRenderer()
const feedback = ref('')

const hasPpt = computed(() => !!store.pptJson)
const canSubmit = computed(() => feedback.value.trim().length > 0 && !store.isGenerating)
const buttonText = computed(() => store.isGenerating ? '修改中...' : '发送修改意见')

async function handleSubmit() {
  if (!canSubmit.value) return
  const text = feedback.value
  feedback.value = ''
  const json = await generate(text, true)
  if (json) render()
}
</script>

<template>
  <div v-if="hasPpt" class="feedback-bar">
    <input
      v-model="feedback"
      type="text"
      placeholder="输入修改意见，如：把第3页改成左文右图，标题颜色改成红色..."
      @keydown.enter="handleSubmit"
    />
    <button :disabled="!canSubmit" @click="handleSubmit">
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
.feedback-bar {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: #fff;
  border-top: 1px solid #e2e8f0;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

input:focus {
  border-color: #3b82f6;
}

button {
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

button:hover:not(:disabled) {
  background: #059669;
}

button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>