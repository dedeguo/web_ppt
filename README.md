# Web PPT

> 输入内容，AI 自动生成网页版 PPT —— 实时预览、风格可选、一键下载

## 功能特性

- **AI 驱动生成**：输入文本描述或上传文件（.txt / .md / .docx），AI 自动生成结构化的 PPT 幻灯片
- **三种视觉风格**：商务简洁、学术知识、创意多彩，一键切换
- **实时预览**：生成的 PPT 在右侧 iframe 中即时展示，支持键盘方向键翻页
- **迭代修改**：通过底部反馈栏输入修改意见，AI 重新生成调整后的 PPT
- **一键下载**：满意后点击下载按钮，保存为独立的自包含 HTML 文件，双击即可在浏览器中演示
- **纯前端 SPA**：无需后端服务，API Key 从本地 `.env` 文件读取

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API + `<script setup>`) | 前端框架 |
| Vite | 构建工具与开发服务器 |
| Pinia | 状态管理 |
| mammoth.js | 解析 .docx 文件 |
| OpenAI 兼容 API（流式 SSE） | AI 内容生成 |
| iframe + Blob URL | 安全的 PPT 预览 |

## 项目结构

```
src/
├── main.js                 # 入口文件
├── App.vue                 # 根组件（左右布局）
├── style.css               # 全局样式
├── components/             # 8 个 Vue 组件
│   ├── SidePanel.vue       # 左侧面板容器
│   ├── InputArea.vue       # 文本输入 + 生成按钮
│   ├── FileUploader.vue    # 文件上传
│   ├── StylePicker.vue     # 风格选择器
│   ├── PreviewPanel.vue    # 右侧预览容器
│   ├── PptIframe.vue       # iframe 预览（骨架屏 / 错误 / 空状态）
│   ├── SlideControls.vue   # 下载按钮 + 操作提示
│   └── FeedbackBar.vue     # 修改意见输入
├── composables/            # 5 个组合式函数
│   ├── usePptStore.js      # Pinia 状态管理
│   ├── useApi.js           # API 调用（流式 SSE）
│   ├── useFileParser.js    # 文件解析
│   ├── usePptRenderer.js   # JSON → HTML 模板渲染
│   └── useDownload.js      # 下载 HTML 文件
├── templates/              # 3 套视觉模板
│   ├── shared.js           # esc() / wrapHtml() 公共逻辑
│   ├── business.js         # 商务简洁风格
│   ├── creative.js         # 创意多彩风格
│   └── academic.js         # 学术知识风格
└── prompts/
    └── systemPrompt.js     # AI 系统提示词
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
```

兼容所有 OpenAI 接口协议的 LLM 服务（如 DeepSeek、GLM、Kimi 等），只需修改 `VITE_API_BASE_URL` 和 `VITE_API_MODEL` 即可。

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

## 使用指南

1. 在左侧文本框中输入 PPT 内容（至少 10 个字符），或上传 `.txt` / `.md` / `.docx` 文件
2. 选择 PPT 风格：商务简洁 / 学术知识 / 创意多彩
3. 点击「生成 PPT」按钮，右侧显示骨架屏等待动画
4. AI 生成完成后，PPT 在右侧预览区展示
5. 使用键盘 **← →** 方向键或**点击屏幕**翻页
6. 如需调整，在底部输入框输入修改意见（如「第 3 页改成左文右图」），按回车发送
7. 满意后点击下载按钮，保存为独立 HTML 文件

## PPT 风格

| 风格 | 视觉特征 |
|------|----------|
| **商务简洁** | 白色背景、蓝色左侧标题饰条、`▸` 要点标记 |
| **学术知识** | 浅灰背景、标题装饰线、blockquote 引用块、`—` 要点标记 |
| **创意多彩** | 渐变背景、白色卡片容器、渐变文字、`✦` 要点标记 |

## 架构说明

### 数据流

```
用户输入 → useApi（调用 AI）→ AI 返回 JSON → usePptStore（存储）
    → usePptRenderer（JSON + 模板函数）→ HTML → iframe（预览）
```

### 设计决策

- **AI 返回 JSON 而非 HTML**：降低 token 消耗约 2/3，视觉渲染由前端模板负责，风格控制更灵活
- **模板函数渲染**：三套模板函数（business / creative / academic）各自负责视觉样式，AI 只关注内容和结构
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
介绍java编程语言的基础知识，包括基本语法、数据类型、控制流、函数、对象。
```

## License

MIT