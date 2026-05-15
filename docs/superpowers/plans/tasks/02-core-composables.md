# Phase 2：核心 Composable

> 隶属：[2026-05-15-web-ppt-plan.md](../2026-05-15-web-ppt-plan.md)

---

### 任务 4：usePptStore — Pinia 状态管理

**文件：**
- 创建：`src/composables/usePptStore.js`

- [ ] **步骤 1：创建 `src/composables/usePptStore.js`**

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePptStore = defineStore('ppt', () => {
  const pptHtml = ref('')
  const pptJson = ref(null)
  const isGenerating = ref(false)
  const error = ref('')
  const selectedStyle = ref('business')
  const inputText = ref('')
  const chatHistory = ref([])

  function setPptJson(json) {
    pptJson.value = json
  }

  function setPptHtml(html) {
    pptHtml.value = html
  }

  function setGenerating(val) {
    isGenerating.value = val
  }

  function setError(msg) {
    error.value = msg
  }

  function setStyle(style) {
    selectedStyle.value = style
  }

  function setInputText(text) {
    inputText.value = text
  }

  function addChatMessage(role, content) {
    chatHistory.value.push({ role, content })
    if (chatHistory.value.length > 6) {
      chatHistory.value = chatHistory.value.slice(-6)
    }
  }

  function reset() {
    pptHtml.value = ''
    pptJson.value = null
    isGenerating.value = false
    error.value = ''
    chatHistory.value = []
  }

  return {
    pptHtml,
    pptJson,
    isGenerating,
    error,
    selectedStyle,
    inputText,
    chatHistory,
    setPptJson,
    setPptHtml,
    setGenerating,
    setError,
    setStyle,
    setInputText,
    addChatMessage,
    reset,
  }
})
```

- [ ] **步骤 2：验证项目可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/composables/usePptStore.js
git commit -m "feat: add usePptStore Pinia store"
```

---

### 任务 5：useFileParser — 文件解析

**文件：**
- 创建：`src/composables/useFileParser.js`

- [ ] **步骤 1：创建 `src/composables/useFileParser.js`**

```js
import { ref } from 'vue'
import mammoth from 'mammoth'

const ALLOWED_TYPES = ['.txt', '.md', '.docx']
const MAX_SIZE = 10 * 1024 * 1024

export function useFileParser() {
  const parsedText = ref('')
  const fileName = ref('')
  const parseError = ref('')

  function validate(file) {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_TYPES.includes(ext)) {
      return `不支持的文件格式：${ext}，仅支持 .txt / .md / .docx`
    }
    if (file.size > MAX_SIZE) {
      return `文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），最大 10MB`
    }
    return null
  }

  async function parse(file) {
    parseError.value = ''
    parsedText.value = ''
    fileName.value = ''

    const err = validate(file)
    if (err) {
      parseError.value = err
      return null
    }

    try {
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      let text

      if (ext === '.docx') {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('文件读取失败'))
          reader.readAsText(file)
        })
      }

      parsedText.value = text
      fileName.value = file.name
      return text
    } catch (e) {
      parseError.value = ext === '.docx' ? 'Word 文档解析失败' : '文件读取失败'
      return null
    }
  }

  return {
    parsedText,
    fileName,
    parseError,
    parse,
  }
}
```

- [ ] **步骤 2：验证项目可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/composables/useFileParser.js
git commit -m "feat: add useFileParser for .txt/.md/.docx"
```

---

### 任务 6：System Prompt 生成

**文件：**
- 创建：`src/prompts/systemPrompt.js`

- [ ] **步骤 1：创建 `src/prompts/systemPrompt.js`**

```js
export function buildSystemPrompt() {
  return `你是一个专业的 PPT 设计师。根据用户提供的内容，生成一份结构化的 PPT 幻灯片数据。

要求：
- 按幻灯片为单位组织内容，合理分页
- 每页明确指定 type（cover/toc/content/ending）和 layout（center/left-right/top-down）
- 封面页 type 为 cover，包含 title 和 subtitle
- 目录页 type 为 toc，包含 title 和 items 数组
- 内容页 type 为 content，包含 title、layout、points 数组
- 结尾页 type 为 ending，包含 title 和 text
- 内容简洁有力，每页要点不超过 5 条
- 返回严格 JSON 格式，不包含任何 markdown 代码块标记（不要用 \`\`\`json）

JSON Schema：
{
  "title": "PPT 标题",
  "slides": [
    { "type": "cover", "title": "标题", "subtitle": "副标题" },
    { "type": "content", "title": "页标题", "layout": "left-right|center|top-down", "points": ["要点1"] }
  ]
}`
}

export function buildUserMessage(content, isModify = false, currentJson = null) {
  if (isModify && currentJson) {
    return `以下是当前 PPT 的幻灯片数据：

${JSON.stringify(currentJson, null, 2)}

请做以下修改：${content}

请返回修改后的完整 JSON 数据。`
  }

  return `请根据以下内容生成一份 PPT：

${content}`
}
```

- [ ] **步骤 2：验证项目可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/prompts/systemPrompt.js
git commit -m "feat: add system prompt builder"
```

---

### 任务 7：useApi — API 调用封装

**文件：**
- 创建：`src/composables/useApi.js`

- [ ] **步骤 1：创建 `src/composables/useApi.js`**

```js
import { ref } from 'vue'
import { usePptStore } from './usePptStore'
import { buildSystemPrompt, buildUserMessage } from '../prompts/systemPrompt'

export function useApi() {
  const store = usePptStore()
  const isStreaming = ref(false)

  const apiConfig = {
    key: import.meta.env.VITE_API_KEY,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_API_MODEL || 'gpt-4o',
  }

  function buildMessages(content, isModify = false) {
    const systemMsg = { role: 'system', content: buildSystemPrompt() }
    const userMsg = { role: 'user', content: buildUserMessage(content, isModify, store.pptJson) }

    if (isModify && store.chatHistory.length > 0) {
      const recentHistory = store.chatHistory.slice(-4)
      return [systemMsg, ...recentHistory, userMsg]
    }

    return [systemMsg, userMsg]
  }

  async function generate(content, isModify = false) {
    store.setGenerating(true)
    store.setError('')
    isStreaming.value = true

    store.addChatMessage('user', isModify
      ? `修改意见：${content}`
      : `请根据以下内容生成 PPT：${content.slice(0, 200)}...`
    )

    try {
      const messages = buildMessages(content, isModify)

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
          max_tokens: 4096,
          stream: true,
          response_format: { type: 'json_object' },
        }),
      })

      if (!response.ok) {
        const errData = await response.text()
        throw new Error(`API 请求失败 (${response.status})`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content || ''
            fullContent += content
          } catch {
            continue
          }
        }
      }

      const jsonData = JSON.parse(fullContent)
      store.setPptJson(jsonData)
      store.addChatMessage('assistant', `已生成 ${jsonData.slides?.length || 0} 页 PPT`)

      return jsonData
    } catch (e) {
      store.setError(e.message || 'PPT 生成失败，请重试')
      return null
    } finally {
      store.setGenerating(false)
      isStreaming.value = false
    }
  }

  return {
    generate,
    isStreaming,
  }
}
```

- [ ] **步骤 2：验证项目可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/composables/useApi.js
git commit -m "feat: add useApi with streaming support"
```

---

### 任务 8：usePptRenderer — JSON 渲染为 HTML

**文件：**
- 创建：`src/composables/usePptRenderer.js`

- [ ] **步骤 1：创建 `src/composables/usePptRenderer.js`**

```js
import { usePptStore } from './usePptStore'
import { businessTemplate } from '../templates/business'
import { creativeTemplate } from '../templates/creative'
import { academicTemplate } from '../templates/academic'

const templates = {
  business: businessTemplate,
  creative: creativeTemplate,
  academic: academicTemplate,
}

export function usePptRenderer() {
  const store = usePptStore()

  function render() {
    const json = store.pptJson
    if (!json || !json.slides) {
      store.setError('没有可渲染的 PPT 数据')
      return null
    }

    const templateFn = templates[store.selectedStyle] || templates.business
    const html = templateFn(json)
    store.setPptHtml(html)
    return html
  }

  return { render }
}
```

- [ ] **步骤 2：创建占位模板文件（后续 Phase 4 实现完整模板）**

创建 `src/templates/business.js`：

```js
export function businessTemplate(json) {
  return generateBaseHtml(json, 'business')
}

function generateBaseHtml(json, style) {
  const slidesHtml = json.slides.map((slide, i) => {
    return `<div class="slide${i === 0 ? '' : ' hidden'}" data-index="${i}">
      <div class="slide-content">
        <h1>${escapeHtml(slide.title || '')}</h1>
        ${slide.subtitle ? `<p class="subtitle">${escapeHtml(slide.subtitle)}</p>` : ''}
        ${slide.text ? `<p>${escapeHtml(slide.text)}</p>` : ''}
        ${slide.points ? `<ul>${slide.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
        ${slide.items ? `<ul>${slide.items.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(json.title || 'PPT')}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden; background: #fff; color: #1e293b; }
.slide { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; opacity: 1; transition: opacity 0.4s ease; }
.slide.hidden { opacity: 0; pointer-events: none; }
.slide-content { max-width: 900px; width: 80%; }
h1 { font-size: 48px; font-weight: 700; margin-bottom: 24px; color: #0f172a; }
.subtitle { font-size: 24px; color: #64748b; }
ul { list-style: none; font-size: 22px; line-height: 2; }
li::before { content: '•'; color: #3b82f6; margin-right: 12px; }
.page-indicator { position: fixed; bottom: 24px; right: 32px; color: #94a3b8; font-size: 14px; z-index: 100; }
</style>
</head>
<body>
${slidesHtml}
<div class="page-indicator" id="pageNum">1 / ${json.slides.length}</div>
<script>
let current = 0;
const slides = document.querySelectorAll('.slide');
function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle('hidden', i !== index));
  document.getElementById('pageNum').textContent = (index + 1) + ' / ' + slides.length;
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    current = Math.min(current + 1, slides.length - 1);
    showSlide(current);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    current = Math.max(current - 1, 0);
    showSlide(current);
  }
});
document.addEventListener('click', () => {
  current = Math.min(current + 1, slides.length - 1);
  showSlide(current);
});
</script>
</body>
</html>`
}

function escapeHtml(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
```

- [ ] **步骤 3：创建占位 `src/templates/creative.js` 和 `src/templates/academic.js`**

分别在 creative.js 和 academic.js 中导出同名函数，暂时复用 business.js 的 `generateBaseHtml`。

`src/templates/creative.js`：
```js
export function creativeTemplate(json) {
  const { generateBaseHtml } = await import('./business')
  return generateBaseHtml(json, 'creative')
}
```

等一下，这里的 import 方式不对。模板不应该互相依赖。让我重新设计。

更好的方式：三个模板各自独立实现 `generateBaseHtml`，或者提取公共函数到一个共享文件。

实际上现在 Phase 2 只是占位，详细模板在 Phase 4 实现。Phase 2 只需要让渲染流程能跑通即可。最简单的方式是暂时让三个模板文件导出同一个基础实现。

让我调整 creative.js 和 academic.js 为独立文件。

`src/templates/creative.js`：
```js
export function creativeTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    return `<div class="${cls}" data-index="${i}">
      <div class="slide-content">
        <h1>${escapeHtml(slide.title || '')}</h1>
        ${slide.subtitle ? `<p class="subtitle">${escapeHtml(slide.subtitle)}</p>` : ''}
        ${slide.text ? `<p>${escapeHtml(slide.text)}</p>` : ''}
        ${slide.points ? `<ul>${slide.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
        ${slide.items ? `<ul>${slide.items.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(json.title || 'PPT')}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden; background: linear-gradient(135deg, #fef3c7, #fde68a, #fca5a5, #a5f3fc); color: #1e293b; }
.slide { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; opacity: 1; transition: opacity .4s, transform .4s; }
.slide.hidden { opacity: 0; transform: scale(0.95); pointer-events: none; }
.slide-content { max-width: 900px; width: 80%; background: rgba(255,255,255,.9); border-radius: 16px; padding: 48px; box-shadow: 0 8px 32px rgba(0,0,0,.1); }
h1 { font-size: 48px; font-weight: 700; margin-bottom: 24px; background: linear-gradient(135deg,#ef4444,#f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.subtitle { font-size: 24px; color: #64748b; }
ul { list-style: none; font-size: 22px; line-height: 2.2; }
li::before { content: '✦'; color: #f59e0b; margin-right: 12px; }
.page-indicator { position: fixed; bottom: 24px; right: 32px; color: #94a3b8; font-size: 14px; z-index: 100; }
</style>
</head>
<body>
${slidesHtml}
<div class="page-indicator" id="pageNum">1 / ${json.slides.length}</div>
<script>
let current=0;const slides=document.querySelectorAll('.slide');function show(i){slides.forEach((s,j)=>s.classList.toggle('hidden',j!==i));document.getElementById('pageNum').textContent=(i+1)+' / '+slides.length}document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();current=Math.min(current+1,slides.length-1);show(current)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();current=Math.max(current-1,0);show(current)}});document.addEventListener('click',()=>{current=Math.min(current+1,slides.length-1);show(current)})
</script>
</body>
</html>`
}

function escapeHtml(text) {
  if (!text) return ''
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
```

OK this is getting really long. Let me just write the plan with the actual code in each step. But the files are going to be very long. Let me be more concise in the plan and focus on the structure.

Actually, I think I should just write the plan files with proper code. The user asked for split files, so each file will be manageable. Let me continue with Phase 2.

Actually, let me think about this more carefully. The creative and academic templates can share `escapeHtml` and basic structure. Let me extract that into a shared helper. But that adds more files. Let me just keep it simple - each template is self-contained and Phase 4 will flesh them out fully.

For now in Phase 2, I need the templates to exist so usePptRenderer can import them. Let me write creative.js and academic.js as simple standalone files.</think>

<｜DSML｜tool_calls>
<｜DSML｜invoke name="Write">
<｜DSML｜parameter name="content" string="true"># Phase 2：核心 Composable

> 隶属：[2026-05-15-web-ppt-plan.md](../2026-05-15-web-ppt-plan.md)

---

### 任务 4：usePptStore — Pinia 状态管理

**文件：**
- 创建：`src/composables/usePptStore.js`

- [ ] **步骤 1：创建 `src/composables/usePptStore.js`**

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePptStore = defineStore('ppt', () => {
  const pptHtml = ref('')
  const pptJson = ref(null)
  const isGenerating = ref(false)
  const error = ref('')
  const selectedStyle = ref('business')
  const inputText = ref('')
  const chatHistory = ref([])

  function setPptJson(json) {
    pptJson.value = json
  }

  function setPptHtml(html) {
    pptHtml.value = html
  }

  function setGenerating(val) {
    isGenerating.value = val
  }

  function setError(msg) {
    error.value = msg
  }

  function setStyle(style) {
    selectedStyle.value = style
  }

  function setInputText(text) {
    inputText.value = text
  }

  function addChatMessage(role, content) {
    chatHistory.value.push({ role, content })
    if (chatHistory.value.length > 6) {
      chatHistory.value = chatHistory.value.slice(-6)
    }
  }

  function reset() {
    pptHtml.value = ''
    pptJson.value = null
    isGenerating.value = false
    error.value = ''
    chatHistory.value = []
  }

  return {
    pptHtml,
    pptJson,
    isGenerating,
    error,
    selectedStyle,
    inputText,
    chatHistory,
    setPptJson,
    setPptHtml,
    setGenerating,
    setError,
    setStyle,
    setInputText,
    addChatMessage,
    reset,
  }
})
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/composables/usePptStore.js
git commit -m "feat: add usePptStore Pinia store"
```

---

### 任务 5：useFileParser — 文件解析

**文件：**
- 创建：`src/composables/useFileParser.js`

- [ ] **步骤 1：创建 `src/composables/useFileParser.js`**

```js
import { ref } from 'vue'
import mammoth from 'mammoth'

const ALLOWED_TYPES = ['.txt', '.md', '.docx']
const MAX_SIZE = 10 * 1024 * 1024

export function useFileParser() {
  const parsedText = ref('')
  const fileName = ref('')
  const parseError = ref('')

  function validate(file) {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_TYPES.includes(ext)) {
      return `不支持的文件格式：${ext}，仅支持 .txt / .md / .docx`
    }
    if (file.size > MAX_SIZE) {
      return `文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），最大 10MB`
    }
    return null
  }

  async function parse(file) {
    parseError.value = ''
    parsedText.value = ''
    fileName.value = ''

    const err = validate(file)
    if (err) {
      parseError.value = err
      return null
    }

    try {
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      let text

      if (ext === '.docx') {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('文件读取失败'))
          reader.readAsText(file)
        })
      }

      parsedText.value = text
      fileName.value = file.name
      return text
    } catch (e) {
      parseError.value = ext === '.docx' ? 'Word 文档解析失败' : '文件读取失败'
      return null
    }
  }

  return { parsedText, fileName, parseError, parse }
}
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/composables/useFileParser.js
git commit -m "feat: add useFileParser for .txt/.md/.docx"
```

---

### 任务 6：System Prompt 生成

**文件：**
- 创建：`src/prompts/systemPrompt.js`

- [ ] **步骤 1：创建 `src/prompts/systemPrompt.js`**

```js
export function buildSystemPrompt() {
  return `你是一个专业的 PPT 设计师。根据用户提供的内容，生成一份结构化的 PPT 幻灯片数据。

要求：
- 按幻灯片为单位组织内容，合理分页
- 每页明确指定 type（cover/toc/content/ending）和 layout（center/left-right/top-down）
- 封面页 type 为 cover，包含 title 和 subtitle
- 目录页 type 为 toc，包含 title 和 items 数组
- 内容页 type 为 content，包含 title、layout、points 数组（每条要点简短有力）
- 结尾页 type 为 ending，包含 title 和 text
- 每页要点不超过 5 条
- 返回严格 JSON 格式，不包含任何 markdown 代码块标记（不要用 \`\`\`json）`
}

export function buildUserMessage(content, isModify = false, currentJson = null) {
  if (isModify && currentJson) {
    return `以下是当前 PPT 的幻灯片数据：

${JSON.stringify(currentJson, null, 2)}

请做以下修改：${content}

请返回修改后的完整 JSON 数据。`
  }
  return `请根据以下内容生成一份 PPT：\n\n${content}`
}
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/prompts/systemPrompt.js
git commit -m "feat: add system prompt builder"
```

---

### 任务 7：useApi — API 调用封装

**文件：**
- 创建：`src/composables/useApi.js`

- [ ] **步骤 1：创建 `src/composables/useApi.js`**

```js
import { usePptStore } from './usePptStore'
import { buildSystemPrompt, buildUserMessage } from '../prompts/systemPrompt'

export function useApi() {
  const store = usePptStore()

  const apiConfig = {
    key: import.meta.env.VITE_API_KEY,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_API_MODEL || 'gpt-4o',
  }

  function buildMessages(content, isModify = false) {
    const systemMsg = { role: 'system', content: buildSystemPrompt() }
    const userMsg = { role: 'user', content: buildUserMessage(content, isModify, store.pptJson) }
    if (isModify && store.chatHistory.length > 0) {
      const recent = store.chatHistory.slice(-4)
      return [systemMsg, ...recent, userMsg]
    }
    return [systemMsg, userMsg]
  }

  async function generate(content, isModify = false) {
    store.setGenerating(true)
    store.setError('')
    store.addChatMessage('user', isModify ? `修改意见：${content}` : `生成 PPT：${content.slice(0, 200)}...`)

    try {
      const messages = buildMessages(content, isModify)
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
          max_tokens: 4096,
          stream: true,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
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

      const jsonData = JSON.parse(fullContent)
      store.setPptJson(jsonData)
      store.addChatMessage('assistant', `已生成 ${jsonData.slides?.length || 0} 页 PPT`)
      return jsonData
    } catch (e) {
      store.setError(e.message || 'PPT 生成失败，请重试')
      return null
    } finally {
      store.setGenerating(false)
    }
  }

  return { generate }
}
```

- [ ] **步骤 2：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 3：Commit**

```bash
git add src/composables/useApi.js
git commit -m "feat: add useApi with streaming support"
```

---

### 任务 8：模板占位 + usePptRenderer + useDownload

**文件：**
- 创建：`src/templates/business.js`
- 创建：`src/templates/creative.js`
- 创建：`src/templates/academic.js`
- 创建：`src/composables/usePptRenderer.js`
- 创建：`src/composables/useDownload.js`

- [ ] **步骤 1：创建 `src/templates/business.js`**

```js
export function businessTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    return `<div class="${cls}" data-index="${i}">
      <div class="slide-content">
        <h1>${esc(slide.title || '')}</h1>
        ${slide.subtitle ? `<p class="subtitle">${esc(slide.subtitle)}</p>` : ''}
        ${slide.text ? `<p>${esc(slide.text)}</p>` : ''}
        ${slide.points ? `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${slide.items ? `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, /* css */ `
body { background: #fff; color: #1e293b; }
.slide-content { max-width: 900px; width: 80%; }
h1 { font-size: 48px; font-weight: 700; margin-bottom: 24px; color: #0f172a; border-left: 4px solid #3b82f6; padding-left: 20px; }
.subtitle { font-size: 24px; color: #64748b; margin-top: -12px; margin-bottom: 32px; }
ul { list-style: none; font-size: 22px; line-height: 2.2; }
li::before { content: '▸'; color: #3b82f6; margin-right: 12px; }
  `)
}

function esc(text) {
  if (!text) return ''
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function wrapHtml(json, slidesHtml, extraCss) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(json.title || 'PPT')}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden}
.slide{position:absolute;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity .4s}
.slide.hidden{opacity:0;pointer-events:none}
.page-indicator{position:fixed;bottom:24px;right:32px;color:#94a3b8;font-size:14px;z-index:100}
${extraCss}
</style></head>
<body>${slidesHtml}<div class="page-indicator" id="pn">1 / ${json.slides.length}</div>
<script>
let c=0;const s=document.querySelectorAll('.slide');function sh(i){s.forEach((x,j)=>x.classList.toggle('hidden',j!==i));document.getElementById('pn').textContent=(i+1)+' / '+s.length}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();c=Math.min(c+1,s.length-1);sh(c)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();c=Math.max(c-1,0);sh(c)}})
document.addEventListener('click',()=>{c=Math.min(c+1,s.length-1);sh(c)})
</script></body></html>`
}
```

- [ ] **步骤 2：创建 `src/templates/creative.js`**

```js
export function creativeTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    return `<div class="${cls}" data-index="${i}">
      <div class="slide-content"><div class="card">
        <h1>${esc(slide.title || '')}</h1>
        ${slide.subtitle ? `<p class="subtitle">${esc(slide.subtitle)}</p>` : ''}
        ${slide.text ? `<p>${esc(slide.text)}</p>` : ''}
        ${slide.points ? `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${slide.items ? `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div></div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, /* css */ `
body { background: linear-gradient(135deg, #fef3c7, #fde68a, #fca5a5, #a5f3fc); color: #1e293b; }
.slide-content { max-width: 900px; width: 80%; }
.card { background: rgba(255,255,255,.92); border-radius: 16px; padding: 48px; box-shadow: 0 8px 32px rgba(0,0,0,.1); }
h1 { font-size: 48px; font-weight: 700; margin-bottom: 24px; background: linear-gradient(135deg,#ef4444,#f97316); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.subtitle { font-size: 24px; color: #64748b; }
ul { list-style: none; font-size: 22px; line-height: 2.2; }
li::before { content: '✦'; color: #f59e0b; margin-right: 12px; }
  `)
}

function esc(t) { if (!t) return ''; return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function wrapHtml(j, s, css) {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(j.title||'PPT')}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden}.slide{position:absolute;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity .4s,transform .4s}.slide.hidden{opacity:0;transform:scale(.95);pointer-events:none}.page-indicator{position:fixed;bottom:24px;right:32px;color:#94a3b8;font-size:14px;z-index:100}${css}</style></head><body>${s}<div class="page-indicator" id="pn">1 / ${j.slides.length}</div><script>let c=0;const sl=document.querySelectorAll('.slide');function sh(i){sl.forEach((x,k)=>x.classList.toggle('hidden',k!==i));document.getElementById('pn').textContent=(i+1)+' / '+sl.length}document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();c=Math.min(c+1,sl.length-1);sh(c)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();c=Math.max(c-1,0);sh(c)}})document.addEventListener('click',()=>{c=Math.min(c+1,sl.length-1);sh(c)})</script></body></html>`
}
```

- [ ] **步骤 3：创建 `src/templates/academic.js`**

```js
export function academicTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    return `<div class="${cls}" data-index="${i}">
      <div class="slide-content">
        <div class="header-line"></div>
        <h1>${esc(slide.title || '')}</h1>
        ${slide.subtitle ? `<p class="subtitle">${esc(slide.subtitle)}</p>` : ''}
        ${slide.text ? `<blockquote>${esc(slide.text)}</blockquote>` : ''}
        ${slide.points ? `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${slide.items ? `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, /* css */ `
body { background: #f8fafc; color: #1e293b; }
.slide-content { max-width: 900px; width: 80%; }
.header-line { width: 100%; height: 3px; background: #1e3a5f; margin-bottom: 32px; }
h1 { font-size: 42px; font-weight: 700; margin-bottom: 24px; color: #0f172a; }
.subtitle { font-size: 20px; color: #475569; margin-bottom: 24px; }
blockquote { border-left: 4px solid #1e3a5f; padding: 12px 20px; margin: 16px 0; background: #f1f5f9; font-size: 18px; color: #475569; }
ul { list-style: none; font-size: 20px; line-height: 2.4; }
li::before { content: '—'; color: #1e3a5f; margin-right: 12px; }
  `)
}

function esc(t) { if (!t) return ''; return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function wrapHtml(j, s, css) {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(j.title||'PPT')}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden}.slide{position:absolute;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity .4s}.slide.hidden{opacity:0;pointer-events:none}.page-indicator{position:fixed;bottom:24px;right:32px;color:#94a3b8;font-size:14px;z-index:100}${css}</style></head><body>${s}<div class="page-indicator" id="pn">1 / ${j.slides.length}</div><script>let c=0;const sl=document.querySelectorAll('.slide');function sh(i){sl.forEach((x,k)=>x.classList.toggle('hidden',k!==i));document.getElementById('pn').textContent=(i+1)+' / '+sl.length}document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();c=Math.min(c+1,sl.length-1);sh(c)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();c=Math.max(c-1,0);sh(c)}})document.addEventListener('click',()=>{c=Math.min(c+1,sl.length-1);sh(c)})</script></body></html>`
}
```

- [ ] **步骤 4：创建 `src/composables/usePptRenderer.js`**

```js
import { usePptStore } from './usePptStore'
import { businessTemplate } from '../templates/business'
import { creativeTemplate } from '../templates/creative'
import { academicTemplate } from '../templates/academic'

const templates = {
  business: businessTemplate,
  creative: creativeTemplate,
  academic: academicTemplate,
}

export function usePptRenderer() {
  const store = usePptStore()

  function render() {
    const json = store.pptJson
    if (!json || !json.slides) {
      store.setError('没有可渲染的 PPT 数据')
      return null
    }
    const templateFn = templates[store.selectedStyle] || templates.business
    const html = templateFn(json)
    store.setPptHtml(html)
    return html
  }

  return { render }
}
```

- [ ] **步骤 5：创建 `src/composables/useDownload.js`**

```js
import { usePptStore } from './usePptStore'

export function useDownload() {
  const store = usePptStore()

  function download() {
    if (!store.pptHtml) return

    const title = store.pptJson?.title || 'PPT'
    const date = new Date().toISOString().slice(0, 10)
    const filename = `${title}_${date}.html`

    const blob = new Blob([store.pptHtml], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { download }
}
```

- [ ] **步骤 6：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 7：Commit**

```bash
git add src/templates/ src/composables/usePptRenderer.js src/composables/useDownload.js
git commit -m "feat: add templates, usePptRenderer, useDownload"
```