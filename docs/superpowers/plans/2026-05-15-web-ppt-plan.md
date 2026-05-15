# Web PPT 工具 实现计划

> **面向 AI 代理的工作者：** 使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 构建一个基于 Vue 3 的纯前端 Web PPT 生成工具，AI 返回 JSON 数据，前端渲染为自包含 HTML。

**架构：** 左侧 SidePanel 负责输入/上传/风格选择，右侧 PreviewPanel 用 iframe 沙箱预览。AI 返回结构化 JSON 幻灯片数据，前端 usePptRenderer 根据风格模板渲染为完整 HTML。API 配置从 `.env` 读取。

**技术栈：** Vue 3 + Vite + Pinia，mammoth.js（.docx 解析）

**规格文档：** `docs/superpowers/specs/2026-05-15-web-ppt-design.md`

---

## 文件结构

```
src/
├── main.js                      # 入口，创建 app + Pinia
├── App.vue                      # 根组件，左右分栏布局
├── components/
│   ├── SidePanel.vue            # 左侧输入面板容器
│   ├── InputArea.vue            # 文本输入 + 生成按钮
│   ├── FileUploader.vue         # 文件上传组件
│   ├── StylePicker.vue          # 风格选择器（3 种风格）
│   ├── PreviewPanel.vue         # 右侧预览面板容器
│   ├── PptIframe.vue            # iframe 沙箱渲染
│   ├── SlideControls.vue        # 翻页/缩放/全屏控件
│   └── FeedbackBar.vue          # 修改意见输入
├── composables/
│   ├── usePptStore.js           # Pinia store：全局状态
│   ├── useApi.js                # API 调用封装
│   ├── useFileParser.js         # 文件解析（.txt/.md/.docx）
│   ├── usePptRenderer.js        # JSON → HTML 渲染
│   └── useDownload.js           # 下载功能
├── templates/
│   ├── business.js              # 商务简洁模板
│   ├── creative.js              # 创意多彩模板
│   └── academic.js              # 学术/知识模板
└── prompts/
    └── systemPrompt.js          # System Prompt 生成函数
```

---

## 实现阶段

| 阶段 | 文件 | 内容 |
|------|------|------|
| Phase 1 | [tasks/01-project-init.md](tasks/01-project-init.md) | Vite 脚手架、依赖、配置、基础布局 |
| Phase 2 | [tasks/02-core-composables.md](tasks/02-core-composables.md) | usePptStore、useApi、useFileParser、usePptRenderer、useDownload |
| Phase 3 | [tasks/03-components.md](tasks/03-components.md) | 全部 9 个组件实现 |
| Phase 4 | [tasks/04-templates-and-polish.md](tasks/04-templates-and-polish.md) | 三套风格模板、System Prompt、错误处理、验证 |

---

## 执行顺序

Phase 1 → Phase 2 → Phase 3 → Phase 4

每个 Phase 内的任务顺序执行。每个 Phase 完成后需验证项目可启动且无报错。