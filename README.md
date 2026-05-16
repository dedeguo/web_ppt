# Web PPT

> 输入内容，AI 自动生成网页版 PPT —— 实时预览、风格可选、一键下载

## 功能特性

- **双模式生成**：HTML 模式（AI 直接生成精美完整的 HTML PPT，默认首页）和 JSON 模式（AI 返回结构化 JSON，前端模板渲染）
- **五种预设风格**：商务简洁、学术知识、创意多彩、科技未来、极简黑白，一键切换
- **自定义风格**：支持输入任意风格描述，AI 会根据描述生成对应风格的 PPT
- **实时预览**：生成的 PPT 在右侧实时展示，支持键盘方向键和点击翻页
- **迭代修改**：通过底部反馈栏输入修改意见，AI 重新生成调整后的 PPT
- **一键下载**：满意后点击下载按钮，保存为独立的自包含 HTML 文件，双击即可在浏览器中演示
- **纯前端 SPA**：无需后端服务，API Key 从本地 `.env` 文件读取

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API + `<script setup>`) | 前端框架 |
| Vue Router | 路由管理（`/` HTML 模式，`/json` JSON 模式） |
| Vite | 构建工具与开发服务器 |
| Pinia | 状态管理 |
| mammoth.js | 解析 .docx 文件 |
| OpenAI 兼容 API（流式 SSE） | AI 内容生成 |
| iframe + Blob URL | 安全的 PPT 预览 |

## 项目结构

```
src/
├── main.js                 # 入口文件（挂载 Pinia + Router）
├── App.vue                 # 根组件（顶部导航 + RouterView）
├── style.css               # 全局样式
├── router/
│   └── index.js            # 路由配置（/ → HTML 模式，/json → JSON 模式）
├── views/
│   ├── HtmlMode.vue        # HTML 模式页面
│   └── JsonMode.vue        # JSON 模式页面
├── components/             # 10 个 Vue 组件
│   ├── SidePanel.vue       # 左侧面板容器
│   ├── InputArea.vue       # 文本输入 + 生成按钮
│   ├── FileUploader.vue    # 文件上传
│   ├── StylePicker.vue     # 风格选择器（下拉框 + 自定义输入）
│   ├── FeedbackBar.vue     # 修改意见输入
│   ├── PreviewPanel.vue    # JSON 模式右侧预览容器
│   ├── PptIframe.vue       # JSON 模式 iframe 预览
│   ├── SlideControls.vue   # JSON 模式下载按钮
│   ├── HtmlPreview.vue     # HTML 模式预览
│   └── HtmlControls.vue    # HTML 模式下载按钮
├── composables/            # 6 个组合式函数
│   ├── usePptStore.js      # Pinia 状态管理
│   ├── useApi.js           # JSON 模式 API 调用（流式 SSE）
│   ├── useHtmlApi.js       # HTML 模式 API 调用（流式 SSE）
│   ├── useFileParser.js    # 文件解析
│   ├── usePptRenderer.js   # JSON → HTML 模板渲染
│   └── useDownload.js      # 下载 HTML 文件
├── templates/              # 3 套视觉模板（JSON 模式）
│   ├── shared.js           # 公共逻辑
│   ├── business.js         # 商务简洁风格
│   ├── creative.js         # 创意多彩风格
│   └── academic.js         # 学术知识风格
└── prompts/
    ├── systemPrompt.js     # JSON 模式 AI 系统提示词
    └── htmlSystemPrompt.js # HTML 模式 AI 系统提示词
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API

复制 `.env.example` 为 `.env`，填入你的 API 配置：

```env
VITE_API_KEY=sk-your-api-key
VITE_API_BASE_URL=https://api.openai.com/v1
VITE_API_MODEL=gpt-4o
VITE_API_MAX_TOKENS=65536
```

兼容所有 OpenAI 接口协议的 LLM 服务（如 DeepSeek、GLM、Kimi 等），只需修改 `VITE_API_BASE_URL` 和 `VITE_API_MODEL` 即可。`VITE_API_MAX_TOKENS` 控制最大输出 token 数，默认 65536（64k）。

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器打开 `http://localhost:5173/`。

### 4. 构建生产版本

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages

项目已内置 GitHub Actions 自动部署工作流，每次 push `main` 分支会自动构建并发布到 GitHub Pages。

### 1. 配置 Secrets

在 GitHub 仓库 **Settings → Secrets and variables → Actions → New repository secret** 中添加以下 4 个 Secret：

| Secret 名称 | 说明 | 示例值 |
|---|---|---|
| `VITE_API_KEY` | 你的 API Key | `sk-xxxx` |
| `VITE_API_BASE_URL` | API 基础地址 | `https://api.openai.com/v1` |
| `VITE_API_MODEL` | 模型名称 | `gpt-4o` |
| `VITE_API_MAX_TOKENS` | 最大输出 token 数 | `65536` |

### 2. 启用 GitHub Pages

1. 打开仓库 **Settings → Pages**
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 `gh-pages`，目录 `/ (root)`，点击 **Save**

> 首次 push 后 `gh-pages` 分支会自动创建，如果看不到请等待 Actions 工作流完成。

### 3. 访问在线页面

部署完成后，访问 `https://<你的用户名>.github.io/web_ppt/` 即可使用。

### 注意事项

- `.env` 文件不会被提交到仓库，本地开发需自行创建
- GitHub Pages 使用 hash 路由（`#/json`），而非 history 模式
- 每次 `git push origin main` 都会触发自动部署

## 使用指南

### HTML 模式（默认首页 `/`）

1. 在左侧文本框中输入 PPT 内容（至少 10 个字符），或上传 `.txt` / `.md` / `.docx` 文件
2. 从下拉框选择 PPT 风格，或选择「自定义...」输入自定义风格描述
3. 点击「生成 PPT」按钮
4. AI 生成完成后，PPT 在右侧预览区展示
5. 使用键盘 **← →** 方向键或**点击屏幕**翻页
6. 如需调整，在底部输入框输入修改意见，按回车发送
7. 满意后点击下载按钮，保存为独立 HTML 文件

### JSON 模式（路径 `/json`）

功能与 HTML 模式类似，区别在于 AI 返回结构化 JSON，由前端模板渲染为 HTML。

## PPT 风格

| 风格 | 视觉特征 |
|------|----------|
| **商务简洁** | 深蓝色系、大留白、专业严谨的排版 |
| **学术知识** | 规整布局、引用块设计、严谨排版 |
| **创意多彩** | 丰富渐变色、卡片式设计、活泼视觉元素 |
| **科技未来** | 深色背景、发光效果、赛博朋克元素 |
| **极简黑白** | 纯黑白配色、大字号、极致简约设计 |
| **自定义** | 输入任意风格描述，AI 自由发挥 |

## 架构说明

### 路由设计

```
/      → HtmlMode.vue  →  AI 直接生成完整 HTML
/json  → JsonMode.vue  →  AI 返回 JSON，前端模板渲染
```

### 数据流（HTML 模式）

```
用户输入 + 风格选择 → useHtmlApi（调用 AI）→ AI 返回完整 HTML
    → 提取 HTML 内容 → usePptStore（存储）→ HtmlPreview（iframe 预览）
```

### 数据流（JSON 模式）

```
用户输入 + 风格选择 → useApi（调用 AI）→ AI 返回 JSON → usePptStore（存储）
    → usePptRenderer（JSON + 模板函数）→ HTML → iframe（预览）
```

### 设计决策

- **HTML 模式**：AI 直接生成完整 HTML，风格表现力更强，适合追求精美视觉效果
- **JSON 模式**：AI 返回结构化 JSON，前端模板负责渲染，风格控制更稳定，token 消耗更低
- **iframe 沙箱预览**：使用 `sandbox="allow-scripts"` 隔离 PPT 页面，保障安全性
- **流式响应**：API 使用 SSE 流式读取，提升用户体验

## 文件上传支持

| 格式 | 解析方式 | 限制 |
|------|----------|------|
| .txt | FileReader | 最大 10MB |
| .md | FileReader | 最大 10MB |
| .docx | mammoth.js | 最大 10MB |

## 使用示例

```text
介绍 Java 编程语言的基础知识，包括基本语法、数据类型、控制流、函数、对象。
```

## License

MIT