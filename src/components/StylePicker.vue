<script setup>
import { usePptStore } from '../composables/usePptStore'

const store = usePptStore()

const styles = [
  { value: 'business', label: '商务简洁', desc: '深蓝 / 大留白 / 专业' },
  { value: 'academic', label: '学术知识', desc: '规整 / 引用块 / 严谨' },
  { value: 'creative', label: '创意多彩', desc: '渐变 / 卡片 / 活泼' },
]
</script>

<template>
  <div class="style-picker">
    <label class="style-label">选择风格</label>
    <div class="style-options">
      <button
        v-for="s in styles"
        :key="s.value"
        class="style-option"
        :class="{ active: store.selectedStyle === s.value }"
        @click="store.setStyle(s.value)"
      >
        <span class="style-name">{{ s.label }}</span>
        <span class="style-desc">{{ s.desc }}</span>
      </button>
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

.style-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.style-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, background 0.2s;
}

.style-option:hover {
  border-color: #93c5fd;
}

.style-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.style-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  min-width: 72px;
}

.style-desc {
  font-size: 12px;
  color: #94a3b8;
}
</style>