# HTML 模式 PPT 生成 — 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在现有 JSON 模式基础上，新增 HTML 模式页面，AI 直接返回完整 HTML 作为 PPT

**架构：** 引入 vue-router 实现 `/`（JSON 模式）和 `/html`（HTML 模式）双路由；现有内容迁移至 JsonMode.vue；新增 HtmlMode.vue + useHtmlApi.js + htmlSystemPrompt.js；App.vue 改为路由出口 + 顶部导航

**技术栈：** Vue 3 + vue-router + Pinia + Vite

---

### 任务 1：安装 vue-router

**文件：**
- 修改：`package.json`

- [ ] **步骤 1：安装依赖**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npm install vue-router@4
```

- [ ] **步骤 2：验证安装**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npm list vue-router
```

预期：显示 `vue-router@4.x.x`

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add package.json package-lock.json
git commit -m "build: add vue-router dependency"
```

---

### 任务 2：创建路由配置

**文件：**
- 创建：`src/router/index.js`

- [ ] **步骤 1：创建路由文件**

```js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'JsonMode',
    component: () => import('../views/JsonMode.vue'),
  },
  {
    path: '/html',
    name: 'HtmlMode',
    component: () => import('../views/HtmlMode.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

- [ ] **步骤 2：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/router/index.js
git commit -m "feat: add vue-router configuration"
```

---

### 任务 3：更新 main.js 挂载 router

**文件：**
- 修改：`src/main.js`

- [ ] **步骤 1：修改 main.js**

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

- [ ] **步骤 2：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：`✓ built in Xs`，无报错

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/main.js
git commit -m "feat: mount vue-router in main.js"
```

---

### 任务 4：创建 JsonMode.vue（迁移现有内容）

**文件：**
- 创建：`src/views/JsonMode.vue`

- [ ] **步骤 1：创建 JsonMode.vue**

```vue
<script setup>
import SidePanel from '../components/SidePanel.vue'
import PreviewPanel from '../components/PreviewPanel.vue'
</script>

<template>
  <div class="json-mode-container">
    <aside class="side-panel">
      <SidePanel />
    </aside>
    <main class="preview-panel">
      <PreviewPanel />
    </main>
  </div>
</template>

<style scoped>
.json-mode-container {
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

- [ ] **步骤 2：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：无报错

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/views/JsonMode.vue
git commit -m "feat: create JsonMode view (migrated from App.vue)"
```

---

### 任务 5：更新 App.vue 为路由出口 + 导航

**文件：**
- 修改：`src/App.vue`

- [ ] **步骤 1：重写 App.vue**

```vue
<script setup>
import { RouterView } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function switchMode() {
  router.push(route.path === '/html' ? '/' : '/html')
}
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <span class="nav-title">Web PPT</span>
      <button class="nav-switch" @click="switchMode">
        {{ route.path === '/html' ? '切换到 JSON 模式' : '切换到 HTML 模式' }}
      </button>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.nav-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.nav-switch {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #3b82f6;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.nav-switch:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}
</style>
```

- [ ] **步骤 2：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：无报错

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/App.vue
git commit -m "feat: update App.vue with router-view and mode switch nav"
```

---

### 任务 6：创建 htmlSystemPrompt.js

**文件：**
- 创建：`src/prompts/htmlSystemPrompt.js`

- [ ] **步骤 1：创建提示词文件**

```js
export function buildHtmlSystemPrompt() {
  return `你是一个专业的 PPT 设计师和前端工程师。根据用户提供的内容，生成一份完整的、自包含的 HTML 文件作为 PPT。

要求：
- 返回完整的 HTML 文档，包含 <!DOCTYPE html> 到 </html>
- 所有 CSS 写在 <style> 标签内，不要使用外部样式表
- 所有 JS 写在 <script> 标签内，实现幻灯片翻页功能
- 幻灯片使用键盘方向键（← →）和点击屏幕翻页
- 每页幻灯片使用 .slide 类，当前页显示，其他页隐藏（.hidden { display: none }）
- 页面底部显示页码指示器（如 "1 / 7"）
- 设计风格要精美专业，包含：
  - 精心设计的配色方案
  - 合适的字体大小和行高
  - 装饰性元素（渐变、阴影、边框等）
  - 平滑的切换动画
- 不要返回任何 markdown 代码块标记，直接返回 HTML 代码`
}

export function buildHtmlUserMessage(content, isModify = false, currentHtml = null) {
  if (isModify && currentHtml) {
    return [
      { role: 'user', content: `以下是当前 PPT 的 HTML 代码：\n\n${currentHtml.slice(0, 3000)}...\n\n请做以下修改：${content}\n\n请返回修改后的完整 HTML 代码。` },
    ]
  }
  return [
    { role: 'user', content: `请根据以下内容生成一份精美的 PPT HTML 文件：\n\n${content}` },
  ]
}
```

- [ ] **步骤 2：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/prompts/htmlSystemPrompt.js
git commit -m "feat: add HTML mode system prompt"
```

---

### 任务 7：创建 useHtmlApi.js

**文件：**
- 创建：`src/composables/useHtmlApi.js`

- [ ] **步骤 1：创建 API composable**

```js
import { usePptStore } from './usePptStore'
import { buildHtmlSystemPrompt, buildHtmlUserMessage } from '../prompts/htmlSystemPrompt'

export function useHtmlApi() {
  const store = usePptStore()

  const apiConfig = {
    key: import.meta.env.VITE_API_KEY,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_API_MODEL || 'gpt-4o',
  }

  async function generate(content, isModify = false) {
    store.setGenerating(true)
    store.setError('')
    store.addChatMessage('user', isModify ? `修改意见：${content}` : `生成 PPT：${content.slice(0, 200)}...`)

    try {
      const messages = [
        { role: 'system', content: buildHtmlSystemPrompt() },
        ...buildHtmlUserMessage(content, isModify, store.pptHtml),
      ]

      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.key}`,
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages,
          temperature: 0.7,
          max_tokens: 8192,
          stream: true,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API 请求失败 (${response.status}): ${errorText.slice(0, 200)}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            fullContent += parsed.choices?.[0]?.delta?.content || ''
          } catch { continue }
        }
      }

      const html = extractHtml(fullContent)
      store.setPptHtml(html)
      store.addChatMessage('assistant', 'PPT HTML 生成完成')
      return html
    } catch (e) {
      store.setError(e.message || 'PPT 生成失败，请重试')
      return null
    } finally {
      store.setGenerating(false)
    }
  }

  function extractHtml(content) {
    const match = content.match(/```(?:html)?\s*([\s\S]*?)```/)
    if (match) return match[1].trim()
    const doctypeMatch = content.match(/<!DOCTYPE[\s\S]*?<\/html>/i)
    if (doctypeMatch) return doctypeMatch[0]
    return content
  }

  return { generate }
}
```

- [ ] **步骤 2：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：无报错

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/composables/useHtmlApi.js
git commit -m "feat: add useHtmlApi composable for HTML mode"
```

---

### 任务 8：创建 HtmlPreview.vue

**文件：**
- 创建：`src/components/HtmlPreview.vue`

- [ ] **步骤 1：创建预览组件**

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
```

- [ ] **步骤 2：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：无报错

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/components/HtmlPreview.vue
git commit -m "feat: add HtmlPreview component"
```

---

### 任务 9：创建 HtmlMode.vue

**文件：**
- 创建：`src/views/HtmlMode.vue`

- [ ] **步骤 1：创建 HTML 模式页面**

```vue
<script setup>
import SidePanel from '../components/SidePanel.vue'
import HtmlPreview from '../components/HtmlPreview.vue'
import HtmlControls from '../components/HtmlControls.vue'
</script>

<template>
  <div class="html-mode-container">
    <aside class="side-panel">
      <SidePanel />
    </aside>
    <main class="preview-panel">
      <HtmlPreview />
      <HtmlControls />
    </main>
  </div>
</template>

<style scoped>
.html-mode-container {
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

- [ ] **步骤 2：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：无报错

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/views/HtmlMode.vue
git commit -m "feat: create HtmlMode view"
```

---

### 任务 10：创建 HtmlControls.vue（下载 + 修改意见）

**文件：**
- 创建：`src/components/HtmlControls.vue`

- [ ] **步骤 1：创建控制组件**

```vue
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
```

- [ ] **步骤 2：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：无报错

- [ ] **步骤 3：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/components/HtmlControls.vue
git commit -m "feat: add HtmlControls with download and feedback"
```

---

### 任务 11：更新 SidePanel 支持 HTML 模式

**文件：**
- 修改：`src/components/SidePanel.vue`
- 修改：`src/components/InputArea.vue`

HTML 模式不需要风格选择器，需要检测当前路由隐藏它。

- [ ] **步骤 1：修改 SidePanel.vue**

```vue
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import InputArea from './InputArea.vue'
import FileUploader from './FileUploader.vue'
import StylePicker from './StylePicker.vue'

const route = useRoute()
const isHtmlMode = computed(() => route.path === '/html')
</script>

<template>
  <div class="side-panel-inner">
    <h2 class="panel-title">Web PPT</h2>
    <p class="panel-desc">{{ isHtmlMode ? 'AI 直接生成精美 HTML PPT' : '输入内容，AI 自动生成 PPT' }}</p>
    <InputArea />
    <div class="divider"></div>
    <FileUploader />
    <div v-if="!isHtmlMode" class="divider"></div>
    <StylePicker v-if="!isHtmlMode" />
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

- [ ] **步骤 2：修改 InputArea.vue**

```vue
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

const isHtmlMode = computed(() => route.path === '/html')

const canGenerate = computed(() => {
  return store.inputText.trim().length >= 10 && !store.isGenerating
})

const buttonText = computed(() => {
  if (store.isGenerating) return '生成中...'
  if (store.pptHtml) return '重新生成'
  return '生成 PPT'
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
```

- [ ] **步骤 3：验证编译**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite build 2>&1 | tail -5
```

预期：无报错

- [ ] **步骤 4：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add src/components/SidePanel.vue src/components/InputArea.vue
git commit -m "feat: update SidePanel and InputArea to support HTML mode"
```

---

### 任务 12：最终验证

- [ ] **步骤 1：启动 dev server**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && npx vite --host
```

- [ ] **步骤 2：验证路由切换**

打开 `http://localhost:5173/` 和 `http://localhost:5173/html`，确认：
- 两个页面都能正常加载
- 顶部导航按钮切换正常
- JSON 模式页面显示风格选择器
- HTML 模式页面不显示风格选择器

- [ ] **步骤 3：验证 HTML 模式生成**

在 HTML 模式页面输入内容，点击生成，确认：
- 生成过程中显示骨架屏
- 生成完成后 iframe 中显示 PPT
- 键盘方向键可翻页
- 下载按钮可下载 HTML 文件
- 修改意见可重新生成

- [ ] **步骤 4：验证 JSON 模式不受影响**

切换回 JSON 模式，确认：
- 风格选择器正常显示
- 生成、预览、下载功能正常

- [ ] **步骤 5：Commit**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt && git add .
git commit -m "chore: final verification for HTML mode"
```
