# Web PPT 工具 — 设计规格

> 日期：2026-05-15
> 状态：已批准

## 1. 项目概述

一个基于浏览器的 Web PPT 生成工具。用户输入 PPT 内容（文本或上传文件），选择风格，AI 自动生成完整的自包含 HTML 文件作为 PPT。支持实时预览、对话式修改迭代，满意后下载。

## 2. 技术选型

| 项目 | 选择 |
|------|------|
| 前端框架 | Vue 3 + Vite |
| 状态管理 | Pinia |
| AI 集成 | OpenAI 兼容 API（配置从 .env 读取） |
| 文件解析 | 浏览器端解析（.txt / .md / .docx） |
| 部署方式 | 纯前端 SPA，静态文件即可运行 |

## 3. 整体架构

### 3.1 架构图

```
┌─────────────────────────────────────────┐
│              用户浏览器                    │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ 输入面板   │  │    PPT 预览区         │ │
│  │ ·文本输入  │  │    ·iframe 沙箱渲染    │ │
│  │ ·文件上传  │  │    ·翻页导航           │ │
│  │ ·风格选择  │  │    ·修改意见输入        │ │
│  │ ·生成/下载 │  │    ·缩放/全屏          │ │
│  └──────────┘  └──────────────────────┘ │
│                    │                     │
│         ┌─────────┴─────────┐           │
│         │  useApi (API调用)   │           │
│         │  useFileParser     │           │
│         │  usePptStore       │           │
│         │  usePptRenderer    │           │
│         │  useDownload       │           │
│         └─────────┬─────────┘           │
└───────────────────┼─────────────────────┘
                    │
          ┌─────────┴─────────┐
          │ OpenAI 兼容 API    │
          │ (配置文件注入)      │
          └───────────────────┘
```

### 3.2 数据流

```
用户输入/上传 → useFileParser 解析 → 文本内容
    ↓
文本 + 风格参数 → useApi 调用 AI → JSON 幻灯片数据
    ↓
JSON + 风格模板 → usePptRenderer 渲染 → 完整 HTML
    ↓
HTML → PptIframe 沙箱预览
    ↓
修改意见 → 重复以上流程（带对话上下文）
    ↓
满意 → useDownload 触发文件下载
```

### 3.3 API 配置

API 配置（Key / Base URL / Model）全部从 `.env` 环境变量读取，Vite 构建时注入。用户无需理解 API 概念，只需输入内容和选择风格。

```env
VITE_API_KEY=sk-xxx
VITE_API_BASE_URL=https://api.openai.com/v1
VITE_API_MODEL=gpt-4o
```

## 4. Vue 3 组件树

```
App.vue
├── SidePanel.vue              # 左侧输入面板
│   ├── InputArea.vue          # 文本输入框
│   ├── FileUploader.vue       # 文件上传（.txt/.md/.docx）
│   └── StylePicker.vue        # 风格选择器（商务/学术/创意）
└── PreviewPanel.vue           # 右侧预览面板
    ├── PptIframe.vue          # iframe 沙箱渲染
    ├── SlideControls.vue      # 翻页控件/缩放/全屏
    └── FeedbackBar.vue        # 修改意见输入 + 重新生成按钮
```

### 4.1 Composable（组合式函数）

| 名称 | 职责 |
|------|------|
| `useApi` | 封装 API 调用，支持 streaming 接收，返回 JSON 幻灯片数据 |
| `useFileParser` | 浏览器端解析 .txt / .md / .docx 文件为纯文本 |
| `usePptStore` | Pinia 全局状态：pptHtml / isGenerating / history[] / selectedStyle |
| `usePptRenderer` | 根据 JSON 幻灯片数据 + 风格模板，渲染为完整自包含 HTML |
| `useDownload` | 将 HTML 通过 Blob 触发浏览器下载 |

## 5. AI Prompt 策略

### 5.1 生成策略

AI **不直接返回 HTML**，而是返回结构化的 JSON 幻灯片数据。前端根据 JSON + 风格模板渲染为完整 HTML。

**原因：** AI 单次输出 token 有限，完整 HTML（含 CSS/JS）在页数多时容易超出上限。JSON 约节省 2/3 token，可支持任意页数。

### 5.2 System Prompt 核心

```
你是一个专业的 PPT 设计师。根据用户提供的内容，
生成一份结构化的 PPT 幻灯片数据。

要求：
- 按幻灯片为单位组织内容
- 每页明确指定 type（封面/目录/内容/结尾）和 layout（居中/左右/上下）
- 内容简洁，每页要点不超过 5 条
- 返回严格 JSON 格式，不包含任何 markdown 标记
```

### 5.3 AI 返回 JSON Schema

```json
{
  "title": "PPT 标题",
  "slides": [
    { "type": "cover", "title": "...", "subtitle": "..." },
    { "type": "toc", "title": "目录", "items": ["...", "..."] },
    {
      "type": "content",
      "title": "页标题",
      "layout": "left-right | center | top-down",
      "points": ["要点1", "要点2"],
      "note": "可选备注"
    },
    { "type": "ending", "title": "...", "text": "谢谢观看" }
  ]
}
```

### 5.4 修改迭代

用户提出修改意见时，将**当前 JSON + 用户修改意见**一起发送：

```
System: 你是一个专业的 PPT 设计师...
User: 以下是当前 PPT 的幻灯片数据：
{...JSON...}

请做以下修改：把第3页改成左文右图布局，第5页标题改为"总结与展望"。

请返回修改后的完整 JSON 数据。
```

上下文携带最近 2 轮对话 + 当前 JSON。

## 6. 风格模板

### 6.1 职责分离

| | AI 负责 | 前端负责 |
|------|------|------|
| 内容 | 分页、标题、要点、布局类型 | — |
| 视觉 | — | 配色、字体、间距、动画 |

AI 返回的 JSON 只描述结构和内容，前端三套风格模板负责视觉呈现。同一条 JSON，切换风格模板即可生成三种完全不同视觉效果的 PPT。

### 6.2 三种风格

**商务简洁：**
- 深蓝/白色基调，大留白
- Sans-serif 字体，左侧蓝色装饰线
- 翻页切换：fade 淡入淡出
- 适合：商业演示、项目汇报

**创意多彩：**
- 渐变背景，卡片式布局
- 圆形/图标装饰元素，活泼配色
- 翻页切换：slide 滑动 + scale
- 适合：产品发布、创意展示

**学术/知识：**
- 深蓝基调，规整排版
- 引用块样式，大量文字友好
- 翻页切换：fade
- 适合：技术分享、知识科普

### 6.3 模板实现

前端维护 3 个模板函数，各自返回完整 HTML 字符串。模板包含：

- 内联 CSS（配色变量、布局样式、动画）
- 内联 JS（翻页逻辑、键盘事件、页码显示）
- 根据 JSON 数据动态生成幻灯片 DOM

## 7. 文件上传

### 7.1 支持格式

| 格式 | 解析方式 |
|------|------|
| .txt | `FileReader.readAsText()` |
| .md | `FileReader.readAsText()`，保留标题层级信息 |
| .docx | `mammoth.js` 库解析为 HTML，再提取纯文本 |

### 7.2 限制

- 单文件最大 10MB
- 一次只能上传一个文件
- 不支持格式提示并拒绝
- .docx 解析失败提示并拒绝

## 8. 预览与安全

### 8.1 iframe 沙箱

```html
<iframe sandbox="allow-scripts" ...>
```

- 不开放 `allow-same-origin`（防止访问主应用 DOM）
- 不开放 `allow-popups`
- AI 生成的内容完全隔离

### 8.2 加载状态

| 状态 | 预览区显示 |
|------|------|
| 空闲 | "在左侧输入内容，选择风格，点击生成 PPT" |
| 生成中 | 骨架屏 + 加载动画 + "AI 正在生成 PPT..." |
| 完成 | 生成的 PPT + 翻页控件 |
| 错误 | 错误信息 + 重试按钮 |

## 9. 下载

- 文件名格式：`{PPT标题}_{日期}.html`
- 实现方式：`Blob` + `URL.createObjectURL` + `<a download>`
- 下载的是完整自包含 HTML，双击即可在浏览器中放映
- 可多次下载同一 PPT

## 10. 错误处理

| 场景 | 处理 |
|------|------|
| API 调用失败 | 友好错误提示 + 重试 / 120s 超时 |
| AI 返回非法 JSON | 检测 JSON 有效性，无效时报错提示重试 |
| 文件格式不支持 | 提示并拒绝 |
| 文件超过 10MB | 提示限制并拒绝 |
| .docx 解析失败 | 提示并拒绝 |
| 输入不足 10 字符 | "生成 PPT"按钮禁用 |
| 生成中再次点击 | 按钮禁用，防止重复请求 |

## 11. 非功能需求

- 响应式布局，桌面端为主（1024px+）
- Vue 3 Composition API + `<script setup>`
- 代码不含注释

## 12. 不包含的功能

- 用户登录/注册
- 历史记录持久化（刷新即清空）
- 多文件同时上传
- 自定义风格
- 图片/图表嵌入
- 移动端适配