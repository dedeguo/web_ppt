<script setup>
import { useFileParser } from '../composables/useFileParser'
import { usePptStore } from '../composables/usePptStore'

const store = usePptStore()
const { fileName, parseError, parse } = useFileParser()

async function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const text = await parse(file)
  if (text) {
    store.setInputText(text)
  }
}

function triggerUpload() {
  const input = document.getElementById('file-upload')
  if (input) input.click()
}
</script>

<template>
  <div class="file-uploader">
    <label class="upload-label">上传文件</label>
    <p class="upload-hint">支持 .txt / .md / .docx，最大 10MB</p>
    <input
      id="file-upload"
      type="file"
      accept=".txt,.md,.docx"
      @change="handleFileChange"
      hidden
    />
    <button class="upload-btn" @click="triggerUpload">
      <span v-if="!fileName">选择文件</span>
      <span v-else>{{ fileName }}</span>
    </button>
    <p v-if="parseError" class="upload-error">{{ parseError }}</p>
  </div>
</template>

<style scoped>
.file-uploader {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.upload-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

.upload-btn {
  padding: 10px;
  border: 1px dashed #94a3b8;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, color 0.2s;
}

.upload-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.upload-error {
  font-size: 12px;
  color: #ef4444;
}
</style>