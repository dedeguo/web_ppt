# Phase 1：项目初始化

> 隶属：[2026-05-15-web-ppt-plan.md](../2026-05-15-web-ppt-plan.md)

---

### 任务 1：创建 Vite + Vue 3 项目

- [ ] **步骤 1：创建项目**

```bash
cd /Users/chende/Documents/Codes/trae_demo/web_ppt/webPPt
npm create vite@latest . -- --template vue
```

- [ ] **步骤 2：安装依赖**

```bash
npm install
```

- [ ] **步骤 3：安装项目依赖**

```bash
npm install pinia mammoth
```

- [ ] **步骤 4：验证项目可启动**

```bash
npm run dev
```

预期：浏览器打开后显示 Vite + Vue 默认页面。

- [ ] **步骤 5：Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/ public/
git commit -m "chore: init Vite + Vue 3 project"
```

---

### 任务 2：配置环境变量

**文件：**
- 创建：`.env`
- 创建：`.env.example`

- [ ] **步骤 1：创建 `.env`**

```env
VITE_API_KEY=sk-your-api-key
VITE_API_BASE_URL=https://api.openai.com/v1
VITE_API_MODEL=gpt-4o
```

- [ ] **步骤 2：创建 `.env.example`**

```env
VITE_API_KEY=sk-your-api-key
VITE_API_BASE_URL=https://api.openai.com/v1
VITE_API_MODEL=gpt-4o
```

- [ ] **步骤 3：在 `.gitignore` 中添加 `.env`**

确认 `.gitignore` 包含 `.env` 行。

- [ ] **步骤 4：Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: add env config"
```

---

### 任务 3：清理默认代码 + 搭建 App.vue 基础布局

**文件：**
- 修改：`src/App.vue`
- 修改：`src/style.css`
- 删除：`src/components/HelloWorld.vue`
- 删除：`src/assets/vue.svg`
- 修改：`src/main.js`

- [ ] **步骤 1：删除默认文件**

```bash
rm src/components/HelloWorld.vue src/assets/vue.svg
```

- [ ] **步骤 2：重写 `src/style.css`**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f1f5f9;
  color: #1e293b;
}
```

- [ ] **步骤 3：重写 `src/main.js`**

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **步骤 4：重写 `src/App.vue`（基础左右分栏）**

```vue
<script setup>
</script>

<template>
  <div class="app-container">
    <aside class="side-panel">
      <h2>Web PPT</h2>
    </aside>
    <main class="preview-panel">
      <div class="placeholder">在左侧输入内容，选择风格，点击生成 PPT</div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.side-panel {
  width: 360px;
  min-width: 360px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
  overflow-y: auto;
}

.side-panel h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.preview-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.placeholder {
  color: #94a3b8;
  font-size: 16px;
}
</style>
```

- [ ] **步骤 5：验证**

```bash
npm run dev
```

预期：显示左右分栏布局，左侧标题"Web PPT"，右侧占位文字。

- [ ] **步骤 6：Commit**

```bash
git add src/
git commit -m "feat: add App.vue base layout with side panel and preview area"
```