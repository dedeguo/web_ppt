<script setup>
import InputArea from './InputArea.vue'
import FileUploader from './FileUploader.vue'
import StylePicker from './StylePicker.vue'
</script>

<template>
  <div class="side-panel-inner">
    <h2 class="panel-title">Web PPT</h2>
    <p class="panel-desc">输入内容，AI 自动生成 PPT</p>
    <InputArea />
    <div class="divider"></div>
    <FileUploader />
    <div class="divider"></div>
    <StylePicker />
  </div>
</template>

<style scoped>
.side-panel-inner {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
}

.panel-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.panel-desc {
  font-size: 13px;
  color: #94a3b8;
  margin-top: -10px;
}

.divider {
  height: 1px;
  background: #e2e8f0;
}
</style>