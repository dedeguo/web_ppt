# HTML 模式风格选择功能实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为 HTML 模式添加风格选择功能，支持 5 个预设风格和用户自定义风格描述

**架构：** 在 usePptStore 中新增 customStyle 状态，改造 StylePicker 组件增加预设 + 自定义输入，SidePanel 在 HTML 模式下显示 StylePicker，htmlSystemPrompt 接收风格参数注入 prompt，useHtmlApi 调用时传入风格信息

**技术栈：** Vue 3 Composition API, Pinia

---

### 任务 1：usePptStore 新增 customStyle 状态

**文件：**
- 修改：`src/composables/usePptStore.js`

- [ ] **步骤 1：在 store 中添加 customStyle 状态和 setCustomStyle 方法**

在 `usePptStore.js` 中，在 `selectedStyle` 下方添加：

```javascript
const customStyle = ref('')
```

在 `setStyle` 方法下方添加：

```javascript
function setCustomStyle(text) {
  customStyle.value = text
}
```

在 return 对象中添加 `customStyle` 和 `setCustomStyle`：

```javascript
return {
  // ... existing
  customStyle,
  // ... existing
  setCustomStyle,
}
```

- [ ] **步骤 2：Commit**

```bash
git add src/composables/usePptStore.js
git commit -m "feat(store): 新增 customStyle 状态用于 HTML 模式自定义风格"
```

---

### 任务 2：StylePicker 组件改造

**文件：**
- 修改：`src/components/StylePicker.vue`

- [ ] **步骤 1：扩展预设风格列表到 5 个**

将 `styles` 数组从 3 个扩展为 5 个：

```javascript
const styles = [
  { value: 'business', label: '商务简洁', desc: '深蓝 / 大留白 / 专业' },
  { value: 'academic', label: '学术知识', desc: '规整 / 引用块 / 严谨' },
  { value: 'creative', label: '创意多彩', desc: '渐变 / 卡片 / 活泼' },
  { value: 'tech', label: '科技未来', desc: '深色 / 发光 / 赛博朋克' },
  { value: 'minimal', label: '极简黑白', desc: '纯黑白 / 大字号 / 简约' },
]
```

- [ ] **步骤 2：添加自定义输入框和处理逻辑**

在 `<script setup>` 中添加：

```javascript
function handleStyleClick(value) {
  store.setCustomStyle('')
  store.setStyle(value)
}

function handleCustomInput(event) {
  const value = event.target.value
  store.setCustomStyle(value)
  if (value.trim()) {
    store.setStyle('')
  }
}
```

在 `<template>` 中，预设按钮的 `@click` 改为 `handleStyleClick(s.value)`，在 `</div>`（style-options 结束标签）后添加：

```html
<div class="custom-style-input">
  <input
    type="text"
    class="custom-input"
    :value="store.customStyle"
    @input="handleCustomInput"
    placeholder="或输入自定义风格描述，如：日式和风、复古报纸风格..."
  />
</div>
```

- [ ] **步骤 3：添加自定义输入框样式**

在 `<style scoped>` 末尾添加：

```css
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
```

- [ ] **步骤 4：Commit**

```bash
git add src/components/StylePicker.vue
git commit -m "feat(StylePicker): 扩展预设风格到 5 个，新增自定义风格输入框"
```

---

### 任务 3：SidePanel 在 HTML 模式下显示 StylePicker

**文件：**
- 修改：`src/components/SidePanel.vue`

- [ ] **步骤 1：移除 StylePicker 的 v-if 条件**

将 `<StylePicker v-if="!isHtmlMode" />` 改为 `<StylePicker />`

- [ ] **步骤 2：Commit**

```bash
git add src/components/SidePanel.vue
git commit -m "feat(SidePanel): HTML 模式下显示风格选择器"
```

---

### 任务 4：htmlSystemPrompt 接收风格参数

**文件：**
- 修改：`src/prompts/htmlSystemPrompt.js`

- [ ] **步骤 1：修改 buildHtmlSystemPrompt 函数签名并注入风格描述**

将函数改为：

```javascript
const styleDescriptions = {
  business: '商务简洁风格，使用深蓝色系，大留白，专业严谨的排版',
  academic: '学术知识风格，规整的布局，引用块设计，严谨的排版',
  creative: '创意多彩风格，丰富的渐变色，卡片式设计，活泼的视觉元素',
  tech: '科技未来风格，深色背景，发光效果，赛博朋克元素',
  minimal: '极简黑白风格，纯黑白配色，大字号，极致简约的设计',
}

export function buildHtmlSystemPrompt(selectedStyle = '', customStyle = '') {
  let styleDesc = ''
  if (customStyle && customStyle.trim()) {
    styleDesc = customStyle.trim()
  } else if (selectedStyle && styleDescriptions[selectedStyle]) {
    styleDesc = styleDescriptions[selectedStyle]
  }

  const styleSection = styleDesc ? `\n\n风格要求：${styleDesc}` : ''

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
  - 平滑的切换动画${styleSection}
- 不要返回任何 markdown 代码块标记，直接返回 HTML 代码`
}
```

- [ ] **步骤 2：Commit**

```bash
git add src/prompts/htmlSystemPrompt.js
git commit -m "feat(prompt): buildHtmlSystemPrompt 接收风格参数并注入 prompt"
```

---

### 任务 5：useHtmlApi 传入风格参数

**文件：**
- 修改：`src/composables/useHtmlApi.js`

- [ ] **步骤 1：修改 buildHtmlSystemPrompt 调用**

将：
```javascript
{ role: 'system', content: buildHtmlSystemPrompt() },
```

改为：
```javascript
{ role: 'system', content: buildHtmlSystemPrompt(store.selectedStyle, store.customStyle) },
```

- [ ] **步骤 2：Commit**

```bash
git add src/composables/useHtmlApi.js
git commit -m "feat(useHtmlApi): 调用 buildHtmlSystemPrompt 时传入风格参数"
```

---

### 任务 6：验证构建

- [ ] **步骤 1：运行构建验证**

```bash
npx vite build
```

预期：构建成功，无错误

- [ ] **步骤 2：Commit（如果构建有自动生成的文件变更）**

```bash
git add .
git commit -m "chore: 构建产物更新"
```
