# Phase 3：组件实现

> 隶属：[2026-05-15-web-ppt-plan.md](../2026-05-15-web-ppt-plan.md)

---

### 任务 9：App.vue — 根组件布局

**文件：**
- 修改：`src/App.vue`

- [ ] **步骤 1：重写 `src/App.vue`**

```vue
<script setup>
import SidePanel from './components/SidePanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'
</script>

<template>
  <div class="app-container">
    <aside class="side-panel">
      <SidePanel />
    </aside>
    <main class="preview-panel">
      <PreviewPanel />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
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
```

- [ ] **步骤 2：验证**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/App.vue
git commit -m "feat: update App.vue with SidePanel and PreviewPanel"
```

---

### 任务 10：SidePanel.vue — 左侧面板容器

**文件：**
- 创建：`src/components/SidePanel.vue`

- [ ] **步骤 1：创建 `src/components/SidePanel.vue`**

```vue
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
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/SidePanel.vue
git commit -m "feat: add SidePanel container"
```

---

### 任务 11：InputArea.vue — 文本输入 + 生成按钮

**文件：**
- 创建：`src/components/InputArea.vue`

- [ ] **步骤 1：创建 `src/components/InputArea.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { usePptStore } from '../composables/usePptStore'
import { useApi } from '../composables/useApi'
import { usePptRenderer } from '../composables/usePptRenderer'

const store = usePptStore()
const { generate } = useApi()
const { render } = usePptRenderer()

const canGenerate = computed(() => {
  return store.inputText.trim().length >= 10 && !store.isGenerating
})

const buttonText = computed(() => {
  if (store.isGenerating) return '生成中...'
  if (store.pptJson) return '重新生成'
  return '生成 PPT'
})

async function handleGenerate() {
  if (!canGenerate.value) return
  const json = await generate(store.inputText, false)
  if (json) render()
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
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/InputArea.vue
git commit -m "feat: add InputArea with text input and generate button"
```

---

### 任务 12：FileUploader.vue — 文件上传

**文件：**
- 创建：`src/components/FileUploader.vue`

- [ ] **步骤 1：创建 `src/components/FileUploader.vue`**

```vue
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
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/FileUploader.vue
git commit -m "feat: add FileUploader component"
```

---

### 任务 13：StylePicker.vue — 风格选择器

**文件：**
- 创建：`src/components/StylePicker.vue`

- [ ] **步骤 1：创建 `src/components/StylePicker.vue`**

```vue
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
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/StylePicker.vue
git commit -m "feat: add StylePicker component"
```

---

### 任务 14：PreviewPanel.vue + PptIframe.vue — 预览容器

**文件：**
- 创建：`src/components/PreviewPanel.vue`
- 创建：`src/components/PptIframe.vue`

- [ ] **步骤 1：创建 `src/components/PptIframe.vue`**

```vue
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
  <div class="ppt-iframe-container">
    <div v-if="store.isGenerating" class="loading-state">
      <div class="skeleton">
        <div class="sk-line w-60"></div>
        <div class="sk-line w-80"></div>
        <div class="sk-line w-70"></div>
        <div class="sk-line w-50"></div>
      </div>
      <p>AI 正在生成 PPT...</p>
    </div>
    <div v-else-if="store.error" class="error-state">
      <p class="error-icon">⚠️</p>
      <p>{{ store.error }}</p>
    </div>
    <div v-else-if="!hasContent" class="empty-state">
      <p class="empty-icon">📄</p>
      <p>在左侧输入内容，选择风格，点击生成 PPT</p>
    </div>
    <iframe
      ref="iframeRef"
      class="ppt-iframe"
      :class="{ visible: hasContent && !store.isGenerating && !store.error }"
      sandbox="allow-scripts"
      title="PPT Preview"
    ></iframe>
  </div>
</template>

<style scoped>
.ppt-iframe-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ppt-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.ppt-iframe.visible {
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
```

- [ ] **步骤 2：创建 `src/components/PreviewPanel.vue`**

```vue
<script setup>
import PptIframe from './PptIframe.vue'
import SlideControls from './SlideControls.vue'
import FeedbackBar from './FeedbackBar.vue'
</script>

<template>
  <div class="preview-panel-inner">
    <PptIframe />
    <SlideControls />
    <FeedbackBar />
  </div>
</template>

<style scoped>
.preview-panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
```

- [ ] **步骤 3：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 4：Commit**

```bash
git add src/components/PptIframe.vue src/components/PreviewPanel.vue
git commit -m "feat: add PreviewPanel and PptIframe with loading/error/empty states"
```

---

### 任务 15：SlideControls.vue — 翻页/缩放/全屏

**文件：**
- 创建：`src/components/SlideControls.vue`

- [ ] **步骤 1：创建 `src/components/SlideControls.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { usePptStore } from '../composables/usePptStore'
import { useDownload } from '../composables/useDownload'

const store = usePptStore()
const { download } = useDownload()

const hasPpt = computed(() => !!store.pptHtml)

function handleFullscreen() {
  const iframe = document.querySelector('.ppt-iframe')
  if (iframe) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      iframe.requestFullscreen()
    }
  }
}
</script>

<template>
  <div v-if="hasPpt" class="slide-controls">
    <span class="control-hint">← → 键翻页 | 点击屏幕翻页</span>
    <button @click="handleFullscreen" title="全屏">⛶</button>
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
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/SlideControls.vue
git commit -m "feat: add SlideControls with fullscreen and download"
```

---

### 任务 16：FeedbackBar.vue — 修改意见输入

**文件：**
- 创建：`src/components/FeedbackBar.vue`

- [ ] **步骤 1：创建 `src/components/FeedbackBar.vue`**

```vue
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
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/FeedbackBar.vue
git commit -m "feat: add FeedbackBar for iterative modification"
```