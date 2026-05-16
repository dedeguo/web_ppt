# HTML 模式 PPT 生成 — 设计规格

> 隶属：[2026-05-15-web-ppt-plan.md](../plans/2026-05-15-web-ppt-plan.md)
> 日期：2026-05-16

---

## 1. 概述

在现有 JSON 模式（快速生成）基础上，新增 **HTML 模式（精细生成）** 页面。AI 直接返回完整自包含 HTML 文件作为 PPT，样式完全自由，不受前端模板限制。

两个模式互不干扰，通过路由切换：
- `/` — 现有 JSON 模式页面
- `/html` — 新 HTML 模式页面

---

## 2. 路由架构

### 2.1 路由表

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `JsonMode.vue` | 现有页面（JSON + 模板渲染） |
| `/html` | `HtmlMode.vue` | 新页面（AI 直接返回 HTML） |

### 2.2 导航入口

在两个页面顶部添加切换按钮：
- JSON 模式页面显示「切换到 HTML 模式」
- HTML 模式页面显示「切换到 JSON 模式」

---

## 3. 文件结构

### 3.1 新增文件

```
src/
├── views/
│   ├── JsonMode.vue          # 从 App.vue 迁移现有内容
│   └── HtmlMode.vue          # 新页面
├── router/
│   └── index.js              # vue-router 配置
├── composables/
│   └── useHtmlApi.js         # HTML 模式 API 调用
└── prompts/
    └── htmlSystemPrompt.js   # HTML 模式系统提示词
```

### 3.2 修改文件

| 文件 | 改动 |
|------|------|
| `src/main.js` | 挂载 vue-router |
| `src/App.vue` | 改为 `<router-view>` 路由出口 + 顶部导航栏 |
| `package.json` | 新增 `vue-router` 依赖 |

### 3.3 不变文件

现有所有组件（`components/`）、composable（`composables/useApi.js` 等）、模板（`templates/`）保持不变。

---

## 4. 组件设计

### 4.1 App.vue（根组件）

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
```

### 4.2 JsonMode.vue

将现有 `App.vue` 的内容（`SidePanel` + `PreviewPanel`）移入此文件，保持完全不变。

### 4.3 HtmlMode.vue

布局与 JsonMode 一致，但右侧使用 `HtmlPreview.vue` 组件：

```vue
<script setup>
import SidePanel from '../components/SidePanel.vue'
import HtmlPreview from '../components/HtmlPreview.vue'
</script>

<template>
  <div class="html-mode-container">
    <aside class="side-panel">
      <SidePanel />
    </aside>
    <main class="preview-panel">
      <HtmlPreview />
    </main>
  </div>
</template>
```

### 4.4 HtmlPreview.vue

与 `PptIframe.vue` 类似，但：
- 不依赖 `usePptRenderer`
- 直接接收 HTML 字符串并注入 iframe
- 显示加载/错误/空状态

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
      <p>AI 正在生成 PPT HTML...</p>
    </div>
    <div v-else-if="store.error" class="error-state">
      <p>{{ store.error }}</p>
    </div>
    <div v-else-if="!hasContent" class="empty-state">
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
```

---

## 5. API 设计

### 5.1 useHtmlApi.js

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
          max_tokens: 8192,  // HTML 模式需要更大的 token 上限
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API 请求失败 (${response.status})`)
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

      // 提取 HTML（去除可能的 markdown 包裹）
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
    // 去除 ```html ... ``` 包裹
    const match = content.match(/```(?:html)?\s*([\s\S]*?)```/)
    if (match) return match[1].trim()
    // 提取 <!DOCTYPE ...> 到 </html>
    const doctypeMatch = content.match(/<!DOCTYPE[\s\S]*?<\/html>/i)
    if (doctypeMatch) return doctypeMatch[0]
    return content
  }

  return { generate }
}
```

### 5.2 htmlSystemPrompt.js

```js
export function buildHtmlSystemPrompt() {
  return `你是一个专业的 PPT 设计师和前端工程师。根据用户提供的内容，生成一份完整的、自包含的 HTML 文件作为 PPT。

要求：
- 返回完整的 HTML 文档，包含 <!DOCTYPE html> 到 </html>
- 所有 CSS 写在 <style> 标签内，不要使用外部样式表
- 所有 JS 写在 <script> 标签内，实现幻灯片翻页功能
- 幻灯片使用键盘方向键（← →）和点击屏幕翻页
- 每页幻灯片使用 .slide 类，当前页显示，其他页隐藏
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

---

## 6. 数据流

### 6.1 HTML 模式

```
用户输入 → SidePanel → HtmlMode → useHtmlApi → AI 返回 HTML
    → store.setPptHtml(html) → HtmlPreview → iframe 预览
```

### 6.2 与 JSON 模式对比

| 环节 | JSON 模式 | HTML 模式 |
|------|-----------|-----------|
| AI 返回 | JSON 数据 | 完整 HTML |
| 前端处理 | usePptRenderer 模板渲染 | 直接注入 iframe |
| 风格切换 | 即时（换模板函数） | 需重新调用 AI |
| Token 上限 | 4096 | 8192 |
| 修改意见 | 修改 JSON | 修改 HTML |

---

## 7. 错误处理

### 7.1 API 错误

- 网络错误：显示「网络连接失败，请检查后重试」
- API 返回错误：显示具体错误信息（如 401 未授权）
- Token 超限：显示「内容过长，请减少输入或选择 JSON 模式」

### 7.2 HTML 解析错误

- AI 返回内容无法提取 HTML：显示「AI 返回内容格式异常，请重试」
- iframe 加载失败：显示「预览加载失败」

---

## 8. 测试要点

- [ ] 路由切换正常（`/` ↔ `/html`）
- [ ] HTML 模式生成 PPT 并正确预览
- [ ] 键盘方向键翻页正常
- [ ] 修改意见功能正常
- [ ] 下载 HTML 文件正常
- [ ] JSON 模式不受影响
- [ ] 错误状态正确显示
