<script setup>
import { usePptStore } from '../composables/usePptStore'

const store = usePptStore()

const styles = [
  { value: 'business', label: '商务简洁' },
  { value: 'academic', label: '学术知识' },
  { value: 'creative', label: '创意多彩' },
  { value: 'tech', label: '科技未来' },
  { value: 'minimal', label: '极简黑白' },
]

function handleStyleChange(event) {
  const value = event.target.value
  if (value === 'custom') {
    store.setStyle('')
  } else {
    store.setCustomStyle('')
    store.setStyle(value)
  }
}

function handleCustomInput(event) {
  store.setCustomStyle(event.target.value)
}
</script>

<template>
  <div class="style-picker">
    <label class="style-label">选择风格</label>
    <select
      class="style-select"
      :value="store.customStyle ? 'custom' : store.selectedStyle"
      @change="handleStyleChange"
    >
      <option value="" disabled>请选择风格</option>
      <option
        v-for="s in styles"
        :key="s.value"
        :value="s.value"
      >
        {{ s.label }}
      </option>
      <option value="custom">自定义...</option>
    </select>
    <div v-if="store.selectedStyle === '' || store.customStyle" class="custom-style-input">
      <input
        type="text"
        class="custom-input"
        :value="store.customStyle"
        @input="handleCustomInput"
        placeholder="输入自定义风格描述，如：日式和风、复古报纸风格..."
      />
    </div>
  </div>
</template>

<style scoped>
.style-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.style-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.style-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  box-sizing: border-box;
}

.style-select:focus {
  border-color: #3b82f6;
}

.custom-style-input {
  margin-top: 4px;
}

.custom-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.custom-input:focus {
  border-color: #3b82f6;
}

.custom-input::placeholder {
  color: #94a3b8;
}
</style>
