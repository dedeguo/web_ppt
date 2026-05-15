# Phase 4：模板完善与验证

> 隶属：[2026-05-15-web-ppt-plan.md](../2026-05-15-web-ppt-plan.md)

---

### 任务 17：提取模板公共逻辑

**文件：**
- 创建：`src/templates/shared.js`

当前三个模板文件各有一份 `esc()` 和 `wrapHtml()`，需提取为公共函数。

- [ ] **步骤 1：创建 `src/templates/shared.js`**

```js
export function esc(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function wrapHtml(json, slidesHtml, extraCss = '', extraBodyClass = '') {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(json.title || 'PPT')}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden}
.slide{position:absolute;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity .4s,transform .4s}
.slide-content{max-width:900px;width:80%}
.page-indicator{position:fixed;bottom:24px;right:32px;color:#94a3b8;font-size:14px;z-index:100}
${extraCss}
</style>
</head>
<body${extraBodyClass ? ` class="${extraBodyClass}"` : ''}>
${slidesHtml}
<div class="page-indicator" id="pn">1 / ${json.slides.length}</div>
<script>
let c=0;const s=document.querySelectorAll('.slide');
function sh(i){s.forEach((x,j)=>x.classList.toggle('hidden',j!==i));document.getElementById('pn').textContent=(i+1)+' / '+s.length}
function next(){c=Math.min(c+1,s.length-1);sh(c)}
function prev(){c=Math.max(c-1,0);sh(c)}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();next()}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();prev()}})
document.addEventListener('click',()=>next())
</script>
</body>
</html>`
}
```

- [ ] **步骤 2：更新 `src/templates/business.js` 使用 shared**

```js
import { esc, wrapHtml } from './shared'

export function businessTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    const layoutClass = slide.layout === 'left-right' ? 'layout-lr' : slide.layout === 'top-down' ? 'layout-td' : 'layout-center'

    let content = `<h2>${esc(slide.title || '')}</h2>`
    if (slide.subtitle) content += `<p class="subtitle">${esc(slide.subtitle)}</p>`
    if (slide.text) content += `<p class="body-text">${esc(slide.text)}</p>`
    if (slide.points) content += `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`
    if (slide.items) content += `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`

    return `<div class="${cls} ${layoutClass}" data-index="${i}">
      <div class="slide-content">${content}</div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, /* extraCss */ `
body{background:#fff;color:#1e293b}
.slide-content{padding:0 40px}
h2{font-size:42px;font-weight:700;margin-bottom:32px;color:#0f172a;border-left:4px solid #3b82f6;padding-left:20px}
.subtitle{font-size:22px;color:#64748b;margin-top:-20px;margin-bottom:32px}
.body-text{font-size:20px;color:#475569;line-height:1.8}
ul{list-style:none;font-size:22px;line-height:2.2}
li{padding:4px 0}
li::before{content:'▸';color:#3b82f6;margin-right:14px;font-size:16px}
.layout-center .slide-content{text-align:center}
.layout-center h2{border-left:none;padding-left:0}
.layout-center ul{display:inline-block;text-align:left}
  `)
}
```

- [ ] **步骤 3：更新 `src/templates/creative.js` 使用 shared**

```js
import { esc, wrapHtml } from './shared'

export function creativeTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    const layoutClass = slide.layout === 'left-right' ? 'layout-lr' : slide.layout === 'top-down' ? 'layout-td' : 'layout-center'

    let content = `<h2>${esc(slide.title || '')}</h2>`
    if (slide.subtitle) content += `<p class="subtitle">${esc(slide.subtitle)}</p>`
    if (slide.text) content += `<p class="body-text">${esc(slide.text)}</p>`
    if (slide.points) content += `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`
    if (slide.items) content += `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`

    return `<div class="${cls} ${layoutClass}" data-index="${i}">
      <div class="slide-content"><div class="card">${content}</div></div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, /* extraCss */ `
body{background:linear-gradient(135deg,#fef3c7,#fde68a,#fca5a5,#a5f3fc);color:#1e293b}
.card{background:rgba(255,255,255,.92);border-radius:16px;padding:56px;box-shadow:0 8px 32px rgba(0,0,0,.1)}
h2{font-size:44px;font-weight:700;margin-bottom:28px;background:linear-gradient(135deg,#ef4444,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{font-size:22px;color:#64748b;margin-top:-16px;margin-bottom:28px}
.body-text{font-size:20px;color:#475569;line-height:1.8}
ul{list-style:none;font-size:22px;line-height:2.4}
li{padding:4px 0}
li::before{content:'✦';color:#f59e0b;margin-right:14px}
.layout-center .slide-content{text-align:center}
.layout-center ul{display:inline-block;text-align:left}
  `)
}
```

- [ ] **步骤 4：更新 `src/templates/academic.js` 使用 shared**

```js
import { esc, wrapHtml } from './shared'

export function academicTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    const layoutClass = slide.layout === 'left-right' ? 'layout-lr' : slide.layout === 'top-down' ? 'layout-td' : 'layout-center'

    let content = `<div class="header-line"></div><h2>${esc(slide.title || '')}</h2>`
    if (slide.subtitle) content += `<p class="subtitle">${esc(slide.subtitle)}</p>`
    if (slide.text) content += `<blockquote>${esc(slide.text)}</blockquote>`
    if (slide.points) content += `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`
    if (slide.items) content += `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`

    return `<div class="${cls} ${layoutClass}" data-index="${i}">
      <div class="slide-content">${content}</div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, /* extraCss */ `
body{background:#f8fafc;color:#1e293b}
.header-line{width:100%;height:3px;background:#1e3a5f;margin-bottom:32px}
h2{font-size:40px;font-weight:700;margin-bottom:24px;color:#0f172a}
.subtitle{font-size:20px;color:#475569;margin-bottom:24px}
blockquote{border-left:4px solid #1e3a5f;padding:12px 20px;margin:16px 0;background:#f1f5f9;font-size:18px;color:#475569;line-height:1.7}
.body-text{font-size:18px;color:#334155;line-height:2}
ul{list-style:none;font-size:20px;line-height:2.6}
li{padding:2px 0}
li::before{content:'—';color:#1e3a5f;margin-right:12px}
.layout-center .slide-content{text-align:center}
.layout-center .header-line{margin-left:auto;margin-right:auto;width:60%}
.layout-center ul{display:inline-block;text-align:left}
  `)
}
```

- [ ] **步骤 5：验证可启动**

```bash
npm run dev
```

- [ ] **步骤 6：Commit**

```bash
git add src/templates/
git commit -m "refactor: extract shared template logic, polish three style templates"
```

---

### 任务 18：最终验证与调整

- [ ] **步骤 1：确认所有文件就位**

```bash
ls -la src/main.js src/App.vue src/style.css
ls -la src/components/
ls -la src/composables/
ls -la src/templates/
ls -la src/prompts/
```

预期：所有文件存在。

- [ ] **步骤 2：确认项目编译无错误**

```bash
npm run dev
```

打开浏览器，检查控制台无报错。UI 应显示：
- 左侧：标题 + 输入框 + 生成按钮 + 文件上传 + 风格选择
- 右侧：空状态占位文字
- 风格选择三个按钮可点击切换

- [ ] **步骤 3：配置 `.env` 并端到端测试**

编辑 `.env`，填入真实 API Key：

```env
VITE_API_KEY=sk-your-real-key
VITE_API_BASE_URL=https://api.openai.com/v1
VITE_API_MODEL=gpt-4o
```

重启 dev server，输入测试内容如"介绍 Python 的基本语法"，选择商务风格，点击生成，验证：
- 生成过程中右侧显示骨架屏
- 生成完成后 iframe 中显示 PPT
- 键盘方向键可翻页
- 点击全屏按钮可全屏
- 输入修改意见后发送，PPT 更新
- 点击下载按钮，下载的 HTML 文件双击可打开

- [ ] **步骤 4：Commit**

```bash
git add .
git commit -m "chore: final verification and adjustments"
```

---

### 任务 19：添加 `.gitignore`

- [ ] **步骤 1：确认 `.gitignore` 完整**

```
node_modules
dist
.env
.superpowers
.DS_Store
```

- [ ] **步骤 2：Commit**

```bash
git add .gitignore
git commit -m "chore: update .gitignore"
```