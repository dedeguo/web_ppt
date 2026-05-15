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

  return wrapHtml(json, slidesHtml, `
.slide.hidden{transform:scale(.95)}
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