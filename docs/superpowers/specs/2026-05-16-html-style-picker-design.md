# HTML 模式风格选择功能设计

## 概述

为 HTML 模式添加风格选择功能，支持 5 个预设风格和用户自定义风格描述。

## 架构

### 数据流

```
用户选择风格 → usePptStore 保存 → useHtmlApi 读取 → 注入 htmlSystemPrompt → AI 生成对应风格的 HTML
```

### 组件变更

#### 1. usePptStore.js

新增状态：
- `customStyle` (string) — 自定义风格描述
- `setCustomStyle(text)` — 设置自定义风格

#### 2. StylePicker.vue

改造为同时支持预设和自定义：

**预设风格（5 个）：**
- `business` — 商务简洁 — 深蓝 / 大留白 / 专业
- `academic` — 学术知识 — 规整 / 引用块 / 严谨
- `creative` — 创意多彩 — 渐变 / 卡片 / 活泼
- `tech` — 科技未来 — 深色背景 / 发光效果 / 赛博朋克
- `minimal` — 极简黑白 — 纯黑白 / 大字号 / 极致简约

**自定义输入：**
- 预设下方增加文本输入框
- placeholder: "或输入自定义风格描述，如：日式和风、复古报纸风格..."
- 选预设时清空自定义输入
- 输入自定义时取消预设选择（`selectedStyle = ''`）
- 自定义输入有内容时，优先级高于预设风格

#### 3. SidePanel.vue

- 移除 `v-if="!isHtmlMode"` 条件，HTML 模式下也显示 `StylePicker`

#### 4. htmlSystemPrompt.js

`buildHtmlSystemPrompt` 函数签名改为接收风格参数：

```javascript
buildHtmlSystemPrompt(selectedStyle, customStyle)
```

根据风格生成风格描述追加到 prompt 末尾：

| selectedStyle | 风格描述 |
|--------------|---------|
| business | 商务简洁风格，使用深蓝色系，大留白，专业严谨的排版 |
| academic | 学术知识风格，规整的布局，引用块设计，严谨的排版 |
| creative | 创意多彩风格，丰富的渐变色，卡片式设计，活泼的视觉元素 |
| tech | 科技未来风格，深色背景，发光效果，赛博朋克元素 |
| minimal | 极简黑白风格，纯黑白配色，大字号，极致简约的设计 |
| 自定义 | 使用 customStyle 的内容作为风格描述 |

#### 5. useHtmlApi.js

调用 `buildHtmlSystemPrompt` 时从 store 读取 `selectedStyle` 和 `customStyle` 并传入。

## 文件变更清单

| 文件 | 变更类型 |
|------|---------|
| `src/composables/usePptStore.js` | 新增 `customStyle` 状态和方法 |
| `src/components/StylePicker.vue` | 增加预设 + 自定义输入 |
| `src/components/SidePanel.vue` | HTML 模式显示 StylePicker |
| `src/prompts/htmlSystemPrompt.js` | 接收风格参数注入 prompt |
| `src/composables/useHtmlApi.js` | 传入风格参数 |
